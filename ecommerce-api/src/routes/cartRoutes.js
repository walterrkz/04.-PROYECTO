import express from "express";
import {
  getCarts,
  getCartById,
  getCartByUser,
  updateCart,
  deleteCart,
  addProductToCart,
  deleteProductFromCart
} from "../controllers/cartController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdminMiddleware.js";
import { body, param } from 'express-validator';
import validate from '../middlewares/validation.js';

const router = express.Router();

// Obtener todos los carritos (admin)
router.get("/", authMiddleware, isAdmin, getCarts);

// Obtener carrito por usuario
router.get("/user", authMiddleware, getCartByUser);

router.get(
  "/:id",
  authMiddleware,
  isAdmin,
  param("id").isMongoId().withMessage("Invalid cart id"),
  validate,
  getCartById
);

router.post(
  '/add-product',
  authMiddleware,
  body('productId').isMongoId().withMessage('Invalid product id'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be an integer >= 1'),
  validate,
  addProductToCart
);

router.put(
  '/',
  authMiddleware,
  body('products')
    .isArray({ min: 1 })
    .withMessage('Products must be a non-empty array'),
  body('products.*.product')
    .isMongoId()
    .withMessage('Each item must have a valid product id'),
  body('products.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Each item must have quantity >= 1'),
  validate,
  updateCart
);

// Eliminar carrito
router.delete("/", authMiddleware, deleteCart);

router.delete(
  "/delete-product/:productId",
  authMiddleware,
  param("productId").isMongoId().withMessage("Invalid product id"),
  validate,
  deleteProductFromCart
);

export default router;
