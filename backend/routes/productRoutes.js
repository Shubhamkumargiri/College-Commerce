const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, uploadProductImages, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(getProducts)
  .post(protect, createProduct);

router.post('/upload', protect, upload.array('images', 5), uploadProductImages);

router.route('/:id')
  .get(getProductById)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
