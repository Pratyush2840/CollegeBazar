CREATE TABLE products (
  product_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  asking_price NUMERIC CHECK (asking_price > 0),
  deadline TIMESTAMPTZ,
  seller_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  category VARCHAR(100) DEFAULT 'Uncategorized',
  status VARCHAR(100) DEFAULT 'approval-pending'
);
