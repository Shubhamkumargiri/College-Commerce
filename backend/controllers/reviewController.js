const Review = require('../models/Review');
const User = require('../models/User');
const { createNotification } = require('../utils/createNotification');

const addReview = async (req, res) => {
  try {
    const { seller, rating, comment } = req.body;

    if (!seller || !rating) {
      return res.status(400).json({ message: 'Seller and rating are required' });
    }

    const sellerUser = await User.findById(seller);
    if (!sellerUser) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const review = await Review.findOneAndUpdate(
      { reviewer: req.user._id, seller },
      { rating, comment },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const populated = await Review.findById(review._id).populate('reviewer', 'name profileImage');

    await createNotification(
      seller,
      'New review received',
      `${req.user.name} left a ${rating}-star review.`,
      'review',
      '/profile'
    );

    res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error saving review' });
  }
};

const getSellerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ seller: req.params.sellerId })
      .populate('reviewer', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
};

module.exports = {
  addReview,
  getSellerReviews,
};
