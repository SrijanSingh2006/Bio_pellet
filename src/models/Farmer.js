import mongoose from 'mongoose';

const farmerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  state: { type: String, required: true },
  village: { type: String, required: true, trim: true },
  cropType: { type: String, required: true },
  registeredAt: { type: Date, default: Date.now },
});

const Farmer = mongoose.model('Farmer', farmerSchema);
export default Farmer;
