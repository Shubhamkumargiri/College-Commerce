const User = require('../models/User');
const jwt = require('jsonwebtoken');

const buildImageUrl = (req, filename) => `${req.protocol}://${req.get('host')}/uploads/${filename}`;
const buildAvatarUrl = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}`;

function resolveProfileImage(profileImage, name) {
  if (profileImage && !profileImage.includes('ui-avatars.com/api/?name=User')) {
    return profileImage;
  }

  return buildAvatarUrl(name);
}

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, campus, location, bio, profileImage } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password, // Password hashing happens in Mongoose pre-save middleware
      campus,
      location,
      bio,
      profileImage: req.file ? buildImageUrl(req, req.file.filename) : resolveProfileImage(profileImage, name),
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: resolveProfileImage(user.profileImage, user.name),
        campus: user.campus,
        location: user.location,
        bio: user.bio,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: resolveProfileImage(user.profileImage, user.name),
        campus: user.campus,
        location: user.location,
        bio: user.bio,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: resolveProfileImage(user.profileImage, user.name),
        campus: user.campus,
        location: user.location,
        bio: user.bio,
        role: user.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.campus = req.body.campus || user.campus;
    user.location = req.body.location || user.location;
    user.bio = req.body.bio || user.bio;

    if (req.file) {
      user.profileImage = buildImageUrl(req, req.file.filename);
    } else if (req.body.profileImage !== undefined) {
      user.profileImage = req.body.profileImage || resolveProfileImage('', user.name);
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profileImage: resolveProfileImage(updatedUser.profileImage, updatedUser.name),
      campus: updatedUser.campus,
      location: updatedUser.location,
      bio: updatedUser.bio,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
