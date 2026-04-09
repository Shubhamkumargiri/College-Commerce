const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createOrder,
  getMyOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

const router = express.Router();

router.use(protect);
router.route('/').get(getMyOrders).post(createOrder);
router.put('/:id', updateOrderStatus);

module.exports = router;
