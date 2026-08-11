import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-order/:bid_id', authMiddleware, createOrder);
router.post('/verify', authMiddleware, verifyPayment);

export default router;
