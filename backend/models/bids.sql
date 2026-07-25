CREATE TABLE bids (
  bid_id SERIAL PRIMARY KEY,
  amount NUMERIC CHECK (amount > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  buyer_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE
  status TEXT CHECK (status IN ('highest', 'outbid', 'outdated', 'purchased')) DEFAULT 'highest'
);

CREATE UNIQUE INDEX one_highest_bid_per_product
ON bids (product_id)
WHERE status = 'highest';

CREATE UNIQUE INDEX one_purchased_bid_per_product
ON bids (product_id)
WHERE status = 'purchased';