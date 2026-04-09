const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  originalPrice: {
    type: Number
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    trim: true
  },
  images: {
    type: [String],
    required: true,
    default: ['https://via.placeholder.com/400']
  },
  type: {
    type: String,
    required: [true, 'Please specify the listing type'],
    enum: ['buy', 'sell', 'rent', 'service']
  },
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  campus: {
    type: String,
    default: 'North Campus'
  },
  location: {
    type: String,
    default: 'Library Gate'
  },
  isNearby: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'unavailable'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
