import db from '../config/db.js';

export const addProduct = async (req, res) => {

    const { name, description, asking_price, deadline, category } = req.body;
    const seller_id = req.user.user_id;

    if (!name || !asking_price || !deadline || !category) {
        return res.status(400).json({ error: 'Name, asking_price, deadline and category are required' });
    }

    if (isNaN(Date.parse(deadline)) || new Date(deadline) <= new Date()) {
      return res.status(400).json({ error: 'Deadline must be a valid future date' });
    }

    try {

        const result = await db.query(
        `INSERT INTO products (name, description, asking_price, deadline, seller_id, category)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [name, description || '', asking_price, deadline, seller_id, category]
        );

        res.status(201).json({ message: 'Product added', product: result.rows[0] });

    } 
    catch (err) {
        console.error('Error adding product:', err);
        res.status(500).json({ error: 'Failed to add product' });
    }

};

export const editProduct = async (req, res) => {

    const { product_id } = req.params;
    const { name, description, asking_price, deadline, category} = req.body;
    const seller_id = req.user.user_id;
  
    try {

      const existing = await db.query(
        `SELECT * FROM products WHERE product_id = $1 AND seller_id = $2`,
        [product_id, seller_id]
      );
  
      if (existing.rows.length === 0) {
        return res.status(403).json({ error: 'Unauthorized or product not found' });
      }

      const product = existing.rows[0];
      if (product.status === 'sold' || product.status === 'expired') {
        return res.status(400).json({ error: 'Cannot edit a product that is sold or expired' });
      }
  
      const fields = [];
      const values = [];
      let index = 1;
  
      if (name !== undefined) {
        fields.push(`name = $${index++}`);
        values.push(name);
      }
  
      if (description !== undefined) {
        fields.push(`description = $${index++}`);
        values.push(description);
      }
  
      if (asking_price !== undefined) {
        fields.push(`asking_price = $${index++}`);
        values.push(asking_price);
      }
  
      if (deadline !== undefined) {
        if (isNaN(Date.parse(deadline)) || new Date(deadline) <= new Date()) {
          return res.status(400).json({ error: 'Deadline must be a valid future date' });
        } 
        fields.push(`deadline = $${index++}`);
        values.push(deadline);
      }

      if (category !== undefined) {
        fields.push(`category = $${index++}`);
        values.push(category);
      }
  
      if (fields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }
  
      values.push(product_id);
  
      const query = `
        UPDATE products
        SET ${fields.join(', ')}
        WHERE product_id = $${index}
        RETURNING *;
      `;
  
      const result = await db.query(query, values);
  
      res.status(200).json({ message: 'Product updated', product: result.rows[0] });
  
    } 
    catch (err) {
      console.error('Error editing product:', err);
      res.status(500).json({ error: 'Failed to edit product' });
    }

};
  
  
export const deleteProduct = async (req, res) => {

    const { product_id } = req.params;
    const seller_id = req.user.user_id;

    try {

        const existing = await db.query(
        `SELECT * FROM products WHERE product_id = $1 AND seller_id = $2`,
        [product_id, seller_id]
        );

        if (existing.rows.length === 0) {
        return res.status(403).json({ error: 'Unauthorized or product not found' });
        }

        const product = existing.rows[0];
        if (product.status === 'sold' || product.status === 'expired') {
          return res.status(400).json({ error: 'Cannot edit a product that is sold or expired' });
        }

        await db.query(`DELETE FROM products WHERE product_id = $1`, [product_id]);

        res.status(200).json({ message: 'Product deleted successfully' });

    } 
    catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ error: 'Failed to delete product' });
    }

};

export const getProductsByCategory = async (req, res) => {

  const seller_id = req.user.user_id;
  const category = req.params.category;

  if (!category) {
    return res.status(400).json({ error: 'Category is required' });
  }

  try {

    const result = await db.query(
      `SELECT * FROM products WHERE category = $1 AND status = 'active' AND seller_id != $2`, 
      [category, seller_id]
    );

    res.status(200).json({
      message: 'Products retrieved successfully',
      products: result.rows,
    });

  } 
  catch (err) {
    console.error('Error fetching products by category:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }

};

export const getActiveProducts = async (req, res) => {

  const seller_id = req.user.user_id;

  try {

    const productsResult = await db.query(
      `SELECT * FROM products WHERE deadline > NOW() AND status = 'active' AND seller_id != $1`, [seller_id]
    );

    const products = productsResult.rows;

    if (products.length === 0) {
      return res.status(200).json({ message: 'No active products found', products: [] });
    }

    const productIds = products.map((p) => p.product_id);

    const imagesResult = await db.query(
      `SELECT product_id, image_url FROM product_images WHERE product_id = ANY($1) ORDER BY image_id ASC`,
      [productIds]
    );

    const imageMap = {};
    for (const row of imagesResult.rows) {
      if (!imageMap[row.product_id]) imageMap[row.product_id] = [];
      imageMap[row.product_id].push(row.image_url);
    }

    const enrichedProducts = products.map((product) => ({
      ...product,
      image: (imageMap[product.product_id] || [])[0] || null, 
    }));

    res.status(200).json({
      message: 'Active products retrieved successfully',
      products: enrichedProducts,
    });

  } 
  catch (err) {
    console.error('Error fetching active products:', err);
    res.status(500).json({ error: 'Failed to fetch active products' });
  }
  
};

export const getProductById = async (req, res) => {
  
  const { product_id } = req.params;

  try {

    const productResult = await db.query(
      `SELECT * FROM products WHERE product_id = $1`,
      [product_id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productResult.rows[0];

    const imageResult = await db.query(
      `SELECT image_id, image_url FROM product_images WHERE product_id = $1 ORDER BY image_id ASC`,
      [product_id]
    );

    product.images = imageResult.rows;
    product.image = product.images.length > 0 ? product.images[0].image_url : null; // Primary image

    res.status(200).json({ message: 'Product retrieved successfully', product });

  } 
  catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
  
};

export const getUserProducts = async (req, res) => {

  const seller_id = req.user.user_id;

  try {

    const productsResult = await db.query(
      `SELECT * FROM products WHERE seller_id = $1 ORDER BY deadline DESC`,
      [seller_id]
    );

    const products = productsResult.rows;

    if (products.length === 0) {
      return res.status(200).json({ message: 'No products found', products: [] });
    }

    const productIds = products.map((p) => p.product_id);
    const imagesResult = await db.query(
      `SELECT product_id, image_url FROM product_images WHERE product_id = ANY($1)`,
      [productIds]
    );

    const imagesMap = {};
    for (const row of imagesResult.rows) {
      if (!imagesMap[row.product_id]) {
        imagesMap[row.product_id] = [];
      }
      imagesMap[row.product_id].push(row.image_url);
    }

    const productsWithImages = products.map((product) => ({
      ...product,
      images: imagesMap[product.product_id] || [],
      image: imagesMap[product.product_id][0] || []
    }));

    res.status(200).json({
      message: 'User products retrieved successfully',
      products: productsWithImages,
    });

  } 
  catch (err) {
    console.error('Error fetching user products:', err);
    res.status(500).json({ error: 'Failed to fetch user products' });
  }

};

