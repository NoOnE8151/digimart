import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_GATEWAY_KEY,
  key_secret: process.env.RAZORPAY_GATEWAY_SECRET,
});


export default razorpay;