const express = require('express');
const { getProducts } = require('../controllers/products.routes');
const router = express.Router();

router.get('/', getProducts);

module.exports = router;