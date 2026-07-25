import db from '../config/db.js';

export const placeBid = async (req, res) => {

    const { product_id } = req.params;
    const { amount } = req.body;
    const buyer_id = req.user.user_id;
  
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Bid amount must be greater than zero' });
    }
  
    try {

      await db.query('BEGIN');

      const productResult = await db.query(
        `SELECT * FROM products WHERE product_id = $1 FOR UPDATE`,
        [product_id]
      );

      if (productResult.rows.length === 0) {
        await db.query('ROLLBACK');
        return res.status(404).json({ error: 'Product not found' });
      }

      const product = productResult.rows[0];

      if (product.seller_id === buyer_id) {
        await db.query('ROLLBACK');
        return res.status(400).json({ error: 'You cannot bid on your own product' });
      }

      const highestBidResult = await db.query(
        `SELECT * FROM bids 
        WHERE product_id = $1 AND status = 'highest' 
        ORDER BY amount DESC LIMIT 1 FOR UPDATE`,
        [product_id]
      );

      if (highestBidResult.rows.length > 0) {

        const highestBid = highestBidResult.rows[0];

        if (highestBid.buyer_id === buyer_id) {
          await db.query('ROLLBACK');
          return res.status(400).json({ error: 'You are already the highest bidder' });
        }

        if (amount <= highestBid.amount) {
          await db.query('ROLLBACK');
          return res.status(400).json({
            error: `Bid must be greater than current highest bid (${highestBid.amount})`,
          });
        }

        await db.query(
          `UPDATE bids SET status = 'outbid' WHERE bid_id = $1`,
          [highestBid.bid_id]
        );

      } 
      else {
        
        if (amount <= product.asking_price) {
          await db.query('ROLLBACK');
          return res.status(400).json({
            error: `Bid must be greater than asking price (${product.asking_price})`,
          });
        }

      }

      await db.query(
        `UPDATE bids SET status = 'outdated' 
        WHERE buyer_id = $1 AND product_id = $2 AND status != 'outdated'`,
        [buyer_id, product_id]
      );

      const newBid = await db.query(
        `INSERT INTO bids (amount, buyer_id, product_id, status)
        VALUES ($1, $2, $3, 'highest') RETURNING *`,
        [amount, buyer_id, product_id]
      );

      await db.query('COMMIT');
      res.status(201).json({ message: 'Bid placed successfully', bid: newBid.rows[0] });
  
    } 
    catch (err) {
      await client.query('ROLLBACK');
      console.error('Error placing bid:', err);
      res.status(500).json({ error: 'Failed to place bid' });
    }

  };

export const getAllBidsOnProduct = async (req, res) => {

    const { product_id } = req.params;
  
    try {

      const result = await db.query(
        `SELECT b.*, u.name AS bidder_name, u.user_id, u.roll_no
         FROM bids b
         JOIN users u ON b.buyer_id = u.user_id
         WHERE b.product_id = $1
         ORDER BY b.amount DESC`,
        [product_id]
      );
  
      res.status(200).json({ bids: result.rows });
  
    } 
    catch (err) {
      console.error('Error fetching bids:', err);
      res.status(500).json({ error: 'Failed to fetch bids' });
    }

};
  
export const getHighestBidOnProduct = async (req, res) => {

    const { product_id } = req.params;
  
    try {

      const result = await db.query(
        `SELECT b.*, u.name AS bidder_name, u.user_id, u.roll_no
         FROM bids b
         JOIN users u ON b.buyer_id = u.user_id
         WHERE b.product_id = $1 AND b.status = 'highest'
         LIMIT 1`,
        [product_id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No bids on this product yet' });
      }
  
      res.status(200).json({ highest_bid: result.rows[0] });
  
    } 
    catch (err) {
      console.error('Error fetching highest bid:', err);
      res.status(500).json({ error: 'Failed to fetch highest bid' });
    }

};

export const getMyBids = async (req, res) => {

    const user_id = req.user.user_id;
  
    try {

      const result = await db.query(
        `SELECT b.*, 
                p.name AS product_name, 
                p.asking_price, 
                p.deadline
         FROM bids b
         JOIN products p ON b.product_id = p.product_id
         WHERE b.buyer_id = $1
           AND b.status IN ('highest', 'outbid', 'purchased')
         ORDER BY b.created_at DESC`,
        [user_id]
      );
  
      res.status(200).json({ my_bids: result.rows });
  
    } 
    catch (err) {
      console.error('Error fetching user bids:', err);
      res.status(500).json({ error: 'Failed to fetch your bids' });
    }
    
};

export const getBuyer = async (req, res) => {

  const { product_id } = req.query;

  if (!product_id) {
    res.status(400).json({ error: 'Missing required parameter: product_id' });
  }

  try {

    const result = await db.query(`
      SELECT u.name AS buyer_name, u.roll_no, u.email, b.amount, b.created_at
      FROM bids b
      JOIN users u ON b.buyer_id = u.user_id
      WHERE b.product_id = $1 AND b.status = 'purchased'
      LIMIT 1;
    `, [product_id]);

    if (result.rows.length === 0) {
      res.status(400).json({ error: 'No purchased bid found for this product.' });
    }

    res.status(200).json({ buyer: result.rows[0] });

  } 
  catch (error) {
    console.error('Error in getHighestBidder:', error);
    res.status(500).json({ error: 'Failed to fetch buyer' });
  }

};
  
  
  