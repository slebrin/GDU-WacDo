const express = require('express');
const { getOrders, getOrdersByStatus, getOrder, createOrder, updateOrderStatus, deleteOrder } = require('../controllers/orders.controller');
const { validateOrder, validateOrderStatus, handleValidationErrors } = require('../middleware/validators');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

router.use(auth); // protège toutes les routes orders

router.get('/', authorize('admin'), getOrders);
router.get('/status/:status', authorize('preparateur', 'accueil'), getOrdersByStatus);
router.get('/:orderNumber', authorize('accueil'), getOrder);
router.post('/', authorize('accueil'), validateOrder, handleValidationErrors, createOrder);
router.patch('/:id/status', authorize('preparateur', 'accueil'), validateOrderStatus, handleValidationErrors, updateOrderStatus);
router.delete('/:id', authorize('admin'), deleteOrder);

module.exports = router;