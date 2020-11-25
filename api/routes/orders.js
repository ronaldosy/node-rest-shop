/*
 * Define processing for product route
 *
*/

const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')
const OrderController = require('../controllers/orders');


// Handle GET request
router.get('/', checkAuth, OrderController.orders_get_all );


// Hansle POST request
router.post('/', checkAuth, OrderController.orders_create_order);

// Handle GET request for specific order
router.get('/:orderId', checkAuth, OrderController.orders_get_order);


// Handle delete request
router.delete('/:orderId', checkAuth, OrderController.orders_delete_order);

module.exports = router;