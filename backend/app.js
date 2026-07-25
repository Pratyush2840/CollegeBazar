import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/userRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import bidRoutes from './routes/bidRoutes.js';
import queryRoutes from './routes/queryRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import './cronjob/scheduler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/bid', bidRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
