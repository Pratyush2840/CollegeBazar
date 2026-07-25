CREATE TABLE product_images (
  image_id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
  image_url TEXT NOT NULL
);
