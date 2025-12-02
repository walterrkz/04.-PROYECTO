import express from 'express';
import { body } from 'express-validator';
import validate from '../middlewares/validation.js';
import { register, login, checkEmailAlredyRegistered, refreshToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', [
  body('displayName')
    .notEmpty().withMessage('displayName is required')
    .isLength({ min: 2, max: 50 }).withMessage('displayName must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9\s]+$/).withMessage('displayName must contain only letters, numbers and spaces'),

  body('email')
    .notEmpty().withMessage('email is required')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[a-zA-Z]/).withMessage('Password must contain at least one letter'),

  body('role')
    .isIn(['admin', 'user']).withMessage('Role must be admin or user'),

], validate, register);

router.post('/login', [
  body('email')
    .notEmpty().withMessage('email is required')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('password is required')
], validate, login);

router.get('/check-email', checkEmailAlredyRegistered);

router.post('/refresh-token', refreshToken);

export default router;