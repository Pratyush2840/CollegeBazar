import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { askAboutListing, generateListingAssist } from '../controllers/genaiController.js';

const router = express.Router();

router.post('/ask/:product_id', askAboutListing);
router.post('/listing-assistant', authMiddleware, generateListingAssist);

export default router;
