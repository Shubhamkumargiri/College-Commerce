const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    const query = { _id: { $ne: req.user._id } };

    if (req.query.keyword) {
      const regex = new RegExp(req.query.keyword, 'i');
      query.$or = [{ name: regex }, { email: regex }, { campus: regex }];
    }

    const users = await User.find(query)
      .select('name email profileImage campus location bio role createdAt')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

module.exports = {
  getUsers,
};
