const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');

const getDashboardStats = async (req, res) => {
  try {
    const [users, products, orders, reviews] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Review.countDocuments(),
    ]);

    const recentUsers = await User.find().select('name email role campus createdAt').sort({ createdAt: -1 }).limit(6);
    const recentProducts = await Product.find()
      .populate('seller', 'name')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      stats: { users, products, orders, reviews },
      recentUsers,
      recentProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching admin dashboard' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

const getListings = async (req, res) => {
  try {
    const listings = await Product.find().populate('seller', 'name email').sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching listings' });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'Admin cannot delete own account from dashboard' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
};

const deleteListing = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    await product.deleteOne();
    res.json({ message: 'Listing deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting listing' });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  getListings,
  deleteUser,
  deleteListing,
};
