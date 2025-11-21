const express = require('express');
const { getOrders, getOrdersByStatus, getOrder, createOrder, updateOrderStatus, deleteOrder } = require('../controllers/orders.controller');
const { validateOrder, validateOrderStatus, handleValidationErrors } = require('../middleware/validators');
const router = express.Router();

router.get('/', getOrders);
router.get('/status/:status', getOrdersByStatus);
router.get('/:orderNumber', getOrder);
router.post('/', validateOrder, handleValidationErrors, createOrder);
router.patch('/:id/status', validateOrderStatus, handleValidationErrors, updateOrderStatus);
router.delete('/:id', deleteOrder);

module.exports = router;
