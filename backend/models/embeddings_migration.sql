CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE product_embeddings (
  product_id INTEGER PRIMARY KEY REFERENCES products(product_id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(768) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
