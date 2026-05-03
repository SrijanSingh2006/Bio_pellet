import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("❌ Razorpay order error:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};