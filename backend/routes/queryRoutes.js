import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { postQuery, getQueriesOnProduct, respondToQuery, editQuery, deleteQuery } from '../controllers/queryController.js';

const router = express.Router();

router.post('/:product_id', authMiddleware, postQuery);
router.put('/edit/:query_id', authMiddleware, editQuery);
router.delete('/delete/:query_id', authMiddleware, deleteQuery);
router.get('/:product_id', authMiddleware, getQueriesOnProduct);
router.post('/respond/:query_id', authMiddleware, respondToQuery);

export default router;
