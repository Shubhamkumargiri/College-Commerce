const express = require('express');
const { protect } = require('../middleware/auth');
const { addReview, getSellerReviews } = require('../controllers/reviewController');

const router = express.Router();

router.get('/:sellerId', getSellerReviews);
router.post('/', protect, addReview);

module.exports = router;
