import Cart from "../models/cart.js";

async function getCarts(req, res, next) {
  try {
    const carts = await Cart.find()
      .populate("user")
      .populate("products.product");
    res.json(carts);
  } catch (error) {
    next(error);
  }
}

async function getCartById(req, res, next) {
  try {
    const id = req.params.id;
    const cart = await Cart.findById(id)
      .populate("user")
      .populate("products.product");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.json(cart);
  } catch (error) {
    next(error);
  }
}

async function getCartByUser(req, res, next) {
  try {
    const userId = req.user.userId;

    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: "user",
        select: "displayName email role isActive",
      })
      .populate({
        path: "products.product",
        select: "name price imagesUrl category stock",
        populate: {
          path: "category",
          select: "name",
        },
      });

    if (!cart) {
      return res.status(404).json({ message: "No cart found for this user" });
    }

    res.json(cart);
  } catch (error) {
    next(error);
  }
}

async function updateCart(req, res, next) {
  try {
    const { products } = req.body;
    const userId = req.user.userId;

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ error: "Products array is required" });
    }

    // Validar que cada producto tenga los campos requeridos
    for (const item of products) {
      if (!item.product || !item.quantity || item.quantity < 1) {
        return res.status(400).json({
          error: "Each product must have product ID and quantity >= 1",
        });
      }
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { user: userId },
      { products },
      { new: true, runValidators: true }
    )
      .populate("user")
      .populate("products.product");

    if (updatedCart) {
      return res.status(200).json(updatedCart);
    } else {
      return res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    next(error);
  }
}

async function deleteCart(req, res) {
  try {
    const userId = req.user.userId;
    const deletedCart = await Cart.findOneAndDelete({ user: userId });

    if (deletedCart) {
      return res.status(200).json({ message: "Cart deleted succesfully" });
    } else {
      return res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function addProductToCart(req, res, next) {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    if (!userId || !productId || quantity < 1) {
      return res.status(400).json({
        error: "User ID, product ID, and valid quantity are required",
      });
    }

    // Buscar el carrito del usuario
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Si no existe carrito, crear uno nuevo
      cart = new Cart({
        user: userId,
        products: [{ product: productId, quantity }],
      });
    } else {
      // Si existe carrito, verificar si el producto ya está
      const existingProductIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingProductIndex >= 0) {
        // Si el producto ya existe, actualizar cantidad
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        // Si el producto no existe, agregarlo
        cart.products.push({ product: productId, quantity });
      }
    }

    await cart.save();
    await cart.populate("user");
    await cart.populate("products.product");

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
}

async function deleteProductFromCart(req, res, next) {
  try {
    const userId = req.user.userId;
    const { productId } = req.params; // Recibir el productId por params

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    // Buscar el carrito del usuario
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Filtrar los productos, removiendo el que coincide
    const updatedProducts = cart.products.filter(
      (item) => item.product.toString() !== productId
    );

    // Verificar si realmente se eliminó algo
    if (updatedProducts.length === cart.products.length) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.products = updatedProducts;

    await cart.save();

    await cart.populate("user");
    await cart.populate("products.product");

    res.status(200).json({
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    next(error);
  }
}

export {
  getCarts,
  getCartById,
  getCartByUser,
  updateCart,
  deleteCart,
  addProductToCart,
  deleteProductFromCart,
};
