import Razorpay from 'razorpay';

let razorpayClient = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayClient = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  console.warn('Razorpay keys not set — payment endpoints will return 503 until RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are configured.');
}

export default razorpayClient;
