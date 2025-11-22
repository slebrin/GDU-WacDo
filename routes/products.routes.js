const express = require('express');
const { getProducts, getProductsByCategory, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/products.controller');
const { validateProduct, handleValidationErrors } = require('../middleware/validators');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

router.use(auth, authorize('admin')); // protège toutes les routes products

router.get('/', getProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProduct);
router.post('/', validateProduct, handleValidationErrors, createProduct);
router.put('/:id', validateProduct, handleValidationErrors, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;