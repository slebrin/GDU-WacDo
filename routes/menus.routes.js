const express = require('express');
const { getMenus, getMenu, createMenu, updateMenu, deleteMenu, updateMenuProducts } = require('../controllers/menus.controller');
const { validateMenu, handleValidationErrors } = require('../middleware/validators');
const router = express.Router();

router.get('/', getMenus);
router.get('/:id', getMenu);
router.post('/', validateMenu, handleValidationErrors, createMenu);
router.put('/:id', validateMenu, handleValidationErrors, updateMenu);
router.patch('/:id/products', updateMenuProducts);
router.delete('/:id', deleteMenu);

module.exports = router;