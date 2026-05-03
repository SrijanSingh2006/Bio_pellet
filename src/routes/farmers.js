import express from 'express';
import Farmer from '../models/Farmer.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, phone, state, village, cropType } = req.body;
    if (!name || !phone || !state || !village || !cropType) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const farmer = new Farmer({ name, phone, state, village, cropType });
    await farmer.save();
    res.status(201).json({ message: 'Farmer registered successfully!', farmer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const farmers = await Farmer.find().sort({ registeredAt: -1 });
    res.json(farmers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch farmers.' });
  }
});

export default router;
