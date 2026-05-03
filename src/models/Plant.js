import mongoose from 'mongoose';

const plantSchema = new mongoose.Schema({
  name: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  latitude: Number,
  longitude: Number
});

export default mongoose.model('Plant', plantSchema);