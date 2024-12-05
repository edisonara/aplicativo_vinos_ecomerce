const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Rutas para órdenes
router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/status', orderController.updateOrderStatus);
router.get('/user/:userId', orderController.getOrdersByUser);
router.post('/:id/cancel', orderController.cancelOrder);

module.exports = router;
