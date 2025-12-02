import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  shippingAddress: {},
  paymentMethod: {},
  shippingCost: {},
  totalPrice: {},
  status: {},
  paymentStatus: {},
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
