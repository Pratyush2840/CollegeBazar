CREATE TABLE queries (
  query_id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
  customer_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reply TEXT
);
