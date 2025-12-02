import express from 'express';
import {
  getOrders,
  getOrdersByUser,
  createOrder,
} from '../controllers/orderController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import isAdmin from '../middlewares/isAdminMiddleware.js';
import validate from '../middlewares/validation.js';
import { body } from 'express-validator';

const router = express.Router();

// Obtener todas las órdenes (admin)
router.get('/', authMiddleware, isAdmin, getOrders);

// Obtener órdenes por usuario
router.get('/user', authMiddleware, getOrdersByUser);

router.post(
  "/",
  authMiddleware,
  [
    body("shippingAddress")
      .notEmpty()
      .withMessage("Shipping address is required"),

    body("paymentMethod")
      .notEmpty()
      .withMessage("Payment method is required"),

    body("shippingCost")
      .optional()
      .isNumeric()
      .withMessage("Shipping cost must be a number"),
  ],
  validate,
  createOrder
);

export default router;