import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import plantRoutes from './src/routes/plants.js';
import farmerRoutes from './src/routes/farmers.js';
import subscribeRoutes from './src/routes/subscribe.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;
const MONGO_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

app.use('/api/plants', plantRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/subscribe', subscribeRoutes);

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));