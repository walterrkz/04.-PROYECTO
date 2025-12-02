import express from "express";
import { body, param } from "express-validator";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  searchCategory,
} from "../controllers/categoryController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdminMiddleware.js";
import validate from "../middlewares/validation.js";

const router = express.Router();

router.get("/search", searchCategory);
router.get("/", getCategories);
router.get(
  "/:id",
  param("id").isMongoId().withMessage("Invalid category id"),
  validate,
  getCategoryById
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
    .withMessage("Description must have at least 5 characters"),
  body("parentCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid parentCategory id"),
  validate,
  createCategory
);

router.put(
  "/:id",
  authMiddleware,
  isAdmin,
  param("id").isMongoId().withMessage("Invalid category id"),
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must have at least 3 characters"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 5, max: 140 })
    .withMessage("Description must have at least 5 characters"),
  body("parentCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid parentCategory id"),
  validate,
  updateCategory
);

router.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  param("id").isMongoId().withMessage("Invalid category id"),
  validate,
  deleteCategory
);

export default router;
