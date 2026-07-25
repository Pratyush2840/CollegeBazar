import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { addProduct, editProduct, deleteProduct, getProductsByCategory, getActiveProducts, getProductById, getUserProducts } from '../controllers/productController.js';

const router = express.Router();

router.post('/add-product', authMiddleware, addProduct);
router.put('/edit-product/:product_id', authMiddleware, editProduct);
router.delete('/delete-product/:product_id', authMiddleware, deleteProduct);
router.get('/get-products-by-category/:category', getProductsByCategory);
router.get('/get-active-products/', authMiddleware, getActiveProducts);
router.get('/get-product-by-id/:product_id', getProductById);
router.get('/my-listings', authMiddleware, getUserProducts);

export default router;
