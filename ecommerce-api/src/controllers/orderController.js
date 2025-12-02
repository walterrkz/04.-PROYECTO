import Order from "../models/order.js";
import Cart from "../models/cart.js";

async function getOrders(req, res, next) {
  try {
    const orders = await Order.find()
      .populate([
        { path: "user", select: "displayName email" },
        { path: "products.product" },
      ])
      .sort({ status: 1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

async function getOrdersByUser(req, res, next) {
  try {
    const userId = req.user.userId;
    
    const orders = await Order.find({ user: userId })
      .populate([
        { path: "user", select: "displayName email" },
        { path: "products.product" },
      ])
      .sort({ status: 1 });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

async function createOrder(req, res, next) {
  try {
    const { shippingAddress, paymentMethod, shippingCost = 0 } = req.body;
    const userId = req.user.userId;

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        error: "Shipping address and payment method are required",
      });
    }

    const cart = await Cart.findOne({ user: userId })
      .populate("user", "displayName email")
      .populate("products.product");
    if (!cart || cart.products.length === 0) {
      return res
        .status(400)
        .json({ error: "No cart found or cart is empty for this user" });
    }

    const products = cart.products.map((item) => ({
      productId: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    // Calcular precio total
    const subtotal = products.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const totalPrice = subtotal + shippingCost;

    const productsForOrder = cart.products.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
    }));

    const newOrder = await Order.create({
      user: userId,
      products: productsForOrder,
      shippingAddress,
      paymentMethod,
      shippingCost,
      totalPrice,
      status: "Delivered",
      paymentStatus: "Done",
    });

    await newOrder.populate([
      { path: "user", select: "displayName email" },
      { path: "products.product" },
    ]);

    await Cart.findByIdAndDelete(cart._id);

    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
}

export { getOrders, getOrdersByUser, createOrder };
