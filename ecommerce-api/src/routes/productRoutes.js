import express from "express";
import {
  getProducts,
  getProductById,
  getProductByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsSortedByPrice,
} from "../controllers/productController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdminMiddleware.js";
import validate from "../middlewares/validation.js";
import { query, param, body } from "express-validator";

const router = express.Router();

router.get(
  "/",
  [
    query("page")
      .optional()
      .isNumeric()
      .withMessage("Page parameter must be a number"),
    query("limit")
      .optional()
      .isNumeric()
      .withMessage("Limit parameter must be a number"),
  ],
  validate,
  getProducts
);
router.get(
  "/sortedbyprice",
  validate,
  getProductsSortedByPrice
);
router.get("/search", searchProducts);
router.get("/category/:idCategory",
  param("idCategory").isMongoId().withMessage("Invalid category id"),
  validate,
  getProductByCategory
);
router.get(
  "/:id",
  param("id").isMongoId().withMessage("Invalid product id"),
  validate,
  getProductById
);
router.post(
  "/",
  authMiddleware,
  isAdmin,
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must have at least 3 characters"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 5, max: 140 })
    .withMessage("Description must be 5–140 characters"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("imagesUrl")
    .optional()
    .isArray()
    .withMessage("Images must be an array of URLs")
    .custom((arr) => arr.every((url) => typeof url === "string"))
    .withMessage("Each image must be a string URL"),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid category id"),
  validate,
  createProduct
);
router.put(
  "/:id",
  authMiddleware,
  isAdmin,
  param("id").isMongoId().withMessage("Invalid product id"),
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name must have at least 3 characters"),
  body("description")
    .optional()
    .isLength({ min: 5, max: 140 })
    .withMessage("Description must be 5–140 characters"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("imagesUrl")
    .optional()
    .isArray()
    .withMessage("Images must be an array of URLs")
    .custom((arr) => arr.every((url) => typeof url === "string"))
    .withMessage("Each image must be a string URL"),
  body("category").optional().isMongoId().withMessage("Invalid category id"),
  validate,
  updateProduct
);
router.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  param("id").isMongoId().withMessage("Invalid product id"),
  validate,
  deleteProduct
);

export default router;
