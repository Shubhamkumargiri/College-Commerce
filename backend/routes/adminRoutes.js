const express = require('express');
const { protect, admin } = require('../middleware/auth');
const {
  getDashboardStats,
  getUsers,
  getListings,
  deleteUser,
  deleteListing,
} = require('../controllers/adminController');

const router = express.Router();

router.use(protect, admin);
router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.get('/listings', getListings);
router.delete('/users/:id', deleteUser);
router.delete('/listings/:id', deleteListing);

module.exports = router;
