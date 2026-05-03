import express from 'express';
import Plant from '../models/Plant.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const plants = await Plant.find();
    res.json(plants);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch plant data' });
  }
});

export default router;