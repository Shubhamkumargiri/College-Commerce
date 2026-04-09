const Product = require('../models/Product');
const Review = require('../models/Review');
const { fileToDataUrl } = require('../utils/image');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const query = { status: 'active' };

    if (req.query.keyword) {
      query.$or = [
        { title: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.keyword, 'i')] } },
      ];
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.type) {
      query.type = req.query.type;
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    if (req.query.nearby === 'true') {
      query.isNearby = true;
    }

    if (req.query.discounted === 'true') {
      query.originalPrice = { $gt: 0 };
    }

    let sortObj = { createdAt: -1 };
    if (req.query.sort === 'priceAsc') sortObj = { price: 1 };
    if (req.query.sort === 'priceDesc') sortObj = { price: -1 };
    if (req.query.sort === 'popular') sortObj = { featured: -1, createdAt: -1 };
    if (req.query.sort === 'titleAsc') sortObj = { title: 1 };

    const products = await Product.find(query)
      .populate('seller', 'name profileImage')
      .sort(sortObj);
      
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email profileImage');

    if (product) {
      const reviews = await Review.find({ seller: product.seller._id })
        .populate('reviewer', 'name profileImage')
        .sort({ createdAt: -1 });

      const averageRating =
        reviews.length > 0
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
          : 0;

      res.json({
        ...product.toObject(),
        reviews,
        averageRating,
      });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching product' });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      originalPrice,
      category,
      type,
      images,
      campus,
      location,
      isNearby,
      featured,
      tags,
    } = req.body;

    const product = new Product({
      title,
      description,
      price,
      originalPrice: originalPrice || null,
      category,
      type,
      images: images && images.length > 0 ? images : undefined,
      seller: req.user._id,
      campus: campus || req.user.campus,
      location: location || req.user.location,
      isNearby: Boolean(isNearby),
      featured: req.user.role === 'admin' ? Boolean(featured) : false,
      tags: Array.isArray(tags)
        ? tags
        : typeof tags === 'string'
          ? tags.split(',').map((tag) => tag.trim()).filter(Boolean)
          : [],
    });

    const createdProduct = await product.save();
    const populated = await createdProduct.populate('seller', 'name profileImage');
    res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating product' });
  }
};

// @desc    Upload product images
// @route   POST /api/products/upload
// @access  Private
const uploadProductImages = async (req, res) => {
  try {
    if (!req.files?.length) {
      return res.status(400).json({ message: 'Please upload at least one image' });
    }

    const images = req.files.map((file) => fileToDataUrl(file)).filter(Boolean);
    res.status(201).json({ images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error uploading images' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    const fields = [
      'title',
      'description',
      'price',
      'originalPrice',
      'category',
      'type',
      'images',
      'campus',
      'location',
      'status',
      'isNearby',
      'featured',
      'tags',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    if (req.body.tags && typeof req.body.tags === 'string') {
      product.tags = req.body.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
    }

    const updatedProduct = await product.save();
    const populated = await updatedProduct.populate('seller', 'name profileImage');
    res.json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating product' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if user is the seller or an admin
      if (product.seller.toString() === req.user._id.toString() || req.user.role === 'admin') {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
      } else {
        res.status(401).json({ message: 'Not authorized to delete this product' });
      }
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  uploadProductImages,
  updateProduct,
  deleteProduct,
};
