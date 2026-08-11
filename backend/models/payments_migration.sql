ALTER TABLE bids DROP CONSTRAINT bids_status_check;
ALTER TABLE bids ADD CONSTRAINT bids_status_check
  CHECK (status IN ('highest', 'outbid', 'outdated', 'accepted', 'purchased'));

CREATE TABLE payments (
  payment_id SERIAL PRIMARY KEY,
  bid_id INTEGER UNIQUE NOT NULL REFERENCES bids(bid_id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
  buyer_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  seller_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  amount NUMERIC CHECK (amount > 0),
  razorpay_order_id TEXT NOT NULL,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  status TEXT CHECK (status IN ('created', 'paid', 'failed')) DEFAULT 'created',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);
