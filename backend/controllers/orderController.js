const Order = require('../models/Order');
const Product = require('../models/Product');
const { createNotification } = require('../utils/createNotification');

const createOrder = async (req, res) => {
  try {
    const { productId, agreedPrice, note } = req.body;
    const product = await Product.findById(productId).populate('seller', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.seller._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot order your own listing' });
    }

    const order = await Order.create({
      buyer: req.user._id,
      seller: product.seller._id,
      product: product._id,
      agreedPrice: agreedPrice || product.price,
      note,
    });

    const populated = await Order.findById(order._id)
      .populate('buyer', 'name profileImage')
      .populate('seller', 'name profileImage')
      .populate('product', 'title images price type');

    await createNotification(
      product.seller._id,
      'New order request',
      `${req.user.name} placed an order request for ${product.title}.`,
      'order',
      '/profile'
    );

    res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating order' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ buyer: req.user._id }, { seller: req.user._id }],
    })
      .populate('buyer', 'name profileImage')
      .populate('seller', 'name profileImage')
      .populate('product', 'title images price type status')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('product', 'title');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const isBuyer = order.buyer.toString() === req.user._id.toString();
    const isSeller = order.seller.toString() === req.user._id.toString();
    if (!isBuyer && !isSeller && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    order.status = req.body.status || order.status;
    const updated = await order.save();

    const notifyUser = isBuyer ? order.seller : order.buyer;
    await createNotification(
      notifyUser,
      'Order updated',
      `The order for ${order.product.title} is now ${updated.status}.`,
      'order',
      '/profile'
    );

    const populated = await Order.findById(updated._id)
      .populate('buyer', 'name profileImage')
      .populate('seller', 'name profileImage')
      .populate('product', 'title images price type status');

    res.json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating order' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  updateOrderStatus,
};
