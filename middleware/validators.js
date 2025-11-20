const { body, validationResult } = require('express-validator');
const { PRODUCT_CATEGORIES } = require('../config/constants');

// Middleware pour gérer les erreurs de validation
exports.handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validation des produits
exports.validateProduct = [
    body('name').notEmpty().withMessage('Le nom est requis').trim(),
    body('price').notEmpty().withMessage('Le prix est requis').isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif'),
    body('category').optional().isIn(PRODUCT_CATEGORIES).withMessage('Catégorie invalide'),
    body('available').optional().isBoolean().withMessage('La disponibilité doit être true ou false')
];

// Validation des menus
exports.validateMenu = [
    body('name').notEmpty().withMessage('Le nom est requis').trim(),
    body('products').isArray({ min: 1 }).withMessage('Le menu doit contenir au moins un produit'),
    body('price').notEmpty().withMessage('Le prix est requis').isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif'),
    body('available').optional().isBoolean().withMessage('La disponibilité doit être true ou false')
];
