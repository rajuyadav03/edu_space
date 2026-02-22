import { body, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array()
    });
  }
  next();
};

export const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').isIn(['teacher', 'school']).withMessage('Role must be either teacher or school'),
  body('phone').notEmpty().withMessage('Phone number is required')
];

export const loginRules = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

export const forgotPasswordRules = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail()
];

export const resetPasswordRules = [
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
];

export const listingRules = [
  body('name').trim().notEmpty().withMessage('Space name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('spaceType').isIn(['Classroom', 'Laboratory', 'Auditorium', 'Sports Hall', 'Library', 'Conference Room']).withMessage('Invalid space type'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('price').isFloat({ min: 0 }).withMessage('Price cannot be negative'),
  body('location').notEmpty().withMessage('Location is required')
];
