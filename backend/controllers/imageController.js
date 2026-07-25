import db from '../config/db.js';
import cloudinary from '../config/cloudinary.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

export const uploadProductImages = async (req, res) => {

  const { product_id } = req.params;
  const seller_id = req.user.user_id;

  try {

    const product = await db.query(
      `SELECT * FROM products WHERE product_id = $1 AND seller_id = $2`,
      [product_id, seller_id]
    );

    if (product.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized or product not found' });
    }

    const countResult = await db.query(
      `SELECT COUNT(*) FROM product_images WHERE product_id = $1`,
      [product_id]
    );
    const existingCount = parseInt(countResult.rows[0].count);

    if (existingCount + req.files.length > 4) {
      return res.status(400).json({ error: 'You can upload up to 4 images only' });
    }

    const uploadedUrls = [];

    for (const file of req.files) {
      const url = await uploadToCloudinary(file.buffer, `product_${product_id}_${Date.now()}`);
      await db.query(
        `INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)`,
        [product_id, url]
      );
      uploadedUrls.push(url);
    }

    res.status(201).json({ message: 'Images uploaded', urls: uploadedUrls });

  } 
  catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ error: 'Failed to upload images' });
  }
  
};

export const getProductImages = async (req, res) => {

  const { product_id } = req.params;

  try {

    const result = await db.query(
      `SELECT image_id, image_url FROM product_images WHERE product_id = $1 ORDER BY image_id ASC`,
      [product_id]
    );

    res.status(200).json({ images: result.rows });

  } 
  catch (err) {
    console.error('Error fetching product images:', err);
    res.status(500).json({ error: 'Failed to fetch product images' });
  }

};

export const deleteProductImage = async (req, res) => {

  const { image_id } = req.params;
  const user_id = req.user.user_id;

  try {
    
    const result = await db.query(
      `SELECT pi.image_url, p.seller_id
       FROM product_images pi
       JOIN products p ON pi.product_id = p.product_id
       WHERE pi.image_id = $1`,
      [image_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const { image_url, seller_id } = result.rows[0];

    if (seller_id !== user_id) {
      return res.status(403).json({ error: 'Unauthorized: not the seller' });
    }

    const publicIdMatch = image_url.match(/\/collegebazaar\/(.+)\.[a-z]+$/);
    if (!publicIdMatch) {
      return res.status(400).json({ error: 'Invalid image URL format' });
    }

    const public_id = `collegebazaar/${publicIdMatch[1]}`;

    const cloudRes = await cloudinary.uploader.destroy(public_id);

    if (cloudRes.result !== 'ok') {
      return res.status(500).json({ error: 'Failed to delete from Cloudinary' });
    }

    await db.query(`DELETE FROM product_images WHERE image_id = $1`, [image_id]);

    res.status(200).json({ message: 'Image deleted successfully' });

  } 
  catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).json({ error: 'Image deletion failed' });
  }
  
};


