const express = require('express');
const { getProducts, getProductsByCategory, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/products.controller');
const { validateProduct, handleValidationErrors } = require('../middleware/validators');
const router = express.Router();

router.get('/', getProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProduct);
router.post('/', validateProduct, handleValidationErrors, createProduct);
router.put('/:id', validateProduct, handleValidationErrors, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;