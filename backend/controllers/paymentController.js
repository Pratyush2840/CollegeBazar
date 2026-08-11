import crypto from 'crypto';
import db from '../config/db.js';
import razorpayClient from '../config/razorpay.js';

export const createOrder = async (req, res) => {

  const { bid_id } = req.params;
  const buyer_id = req.user.user_id;

  if (!razorpayClient) {
    return res.status(503).json({ error: 'Payments are not configured on this server yet' });
  }

  try {

    const bidResult = await db.query(
      `SELECT b.*, p.name AS product_name, p.seller_id
       FROM bids b
       JOIN products p ON b.product_id = p.product_id
       WHERE b.bid_id = $1`,
      [bid_id]
    );

    if (bidResult.rows.length === 0) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    const bid = bidResult.rows[0];

    if (bid.buyer_id !== buyer_id) {
      return res.status(403).json({ error: 'Only the buyer of this bid can pay for it' });
    }

    if (bid.status !== 'accepted') {
      return res.status(400).json({ error: 'This bid has not been accepted by the seller yet' });
    }

    const existingPayment = await db.query(
      `SELECT * FROM payments WHERE bid_id = $1`,
      [bid_id]
    );

    if (existingPayment.rows.length > 0) {
      const payment = existingPayment.rows[0];

      if (payment.status === 'paid') {
        return res.status(400).json({ error: 'This bid has already been paid for' });
      }

      return res.status(200).json({
        order_id: payment.razorpay_order_id,
        amount: Number(payment.amount) * 100,
        currency: 'INR',
        key_id: process.env.RAZORPAY_KEY_ID,
        product_name: bid.product_name,
      });
    }

    const order = await razorpayClient.orders.create({
      amount: Math.round(Number(bid.amount) * 100),
      currency: 'INR',
      receipt: `bid_${bid_id}`,
    });

    await db.query(
      `INSERT INTO payments (bid_id, product_id, buyer_id, seller_id, amount, razorpay_order_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'created')`,
      [bid_id, bid.product_id, buyer_id, bid.seller_id, bid.amount, order.id]
    );

    res.status(201).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
      product_name: bid.product_name,
    });

  }
  catch (err) {
    console.error('Error creating payment order:', err);
    res.status(500).json({ error: 'Failed to create payment order' });
  }

};

export const verifyPayment = async (req, res) => {

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const buyer_id = req.user.user_id;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment verification fields' });
  }

  try {

    await db.query('BEGIN');

    const paymentResult = await db.query(
      `SELECT * FROM payments WHERE razorpay_order_id = $1 FOR UPDATE`,
      [razorpay_order_id]
    );

    if (paymentResult.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ error: 'Payment order not found' });
    }

    const payment = paymentResult.rows[0];

    if (payment.buyer_id !== buyer_id) {
      await db.query('ROLLBACK');
      return res.status(403).json({ error: 'This payment does not belong to you' });
    }

    if (payment.status === 'paid') {
      await db.query('ROLLBACK');
      return res.status(200).json({ message: 'Payment already verified' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      await db.query(
        `UPDATE payments SET status = 'failed' WHERE payment_id = $1`,
        [payment.payment_id]
      );
      await db.query('COMMIT');
      return res.status(400).json({ error: 'Payment signature verification failed' });
    }

    await db.query(
      `UPDATE payments
       SET status = 'paid', razorpay_payment_id = $1, razorpay_signature = $2, paid_at = NOW()
       WHERE payment_id = $3`,
      [razorpay_payment_id, razorpay_signature, payment.payment_id]
    );

    await db.query(`UPDATE bids SET status = 'purchased' WHERE bid_id = $1`, [payment.bid_id]);
    await db.query(`UPDATE products SET status = 'sold' WHERE product_id = $1`, [payment.product_id]);

    await db.query('COMMIT');
    res.status(200).json({ message: 'Payment verified, product marked as sold' });

  }
  catch (err) {
    await db.query('ROLLBACK');
    console.error('Error verifying payment:', err);
    res.status(500).json({ error: 'Failed to verify payment' });
  }

};
