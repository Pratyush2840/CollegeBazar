import express from 'express';
import jwt from 'jsonwebtoken';
import { adminLogin, approveProduct, getApprovalPendingProducts } from '../controllers/adminController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', adminLogin);
router.post('/approve-product', authMiddleware, approveProduct);
router.get('/approval-pending-products', authMiddleware, getApprovalPendingProducts);

export default router;