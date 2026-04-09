const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', upload.single('profileImage'), registerUser);
router.post('/login', loginUser);
router.route('/profile').get(protect, getUserProfile).put(protect, upload.single('profileImage'), updateUserProfile);

module.exports = router;
