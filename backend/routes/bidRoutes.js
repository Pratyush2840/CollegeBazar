import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { placeBid, getAllBidsOnProduct, getHighestBidOnProduct, getMyBids, getBuyer } from '../controllers/bidController.js';

const router = express.Router();

router.post('/place-bid/:product_id', authMiddleware, placeBid);
router.get('/product/:product_id', getAllBidsOnProduct);
router.get('/product/:product_id/highest', getHighestBidOnProduct);
router.get('/my-bids', authMiddleware, getMyBids);
router.get('/get-buyer', authMiddleware, getBuyer);

export default router;
