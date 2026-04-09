const Message = require('../models/Message');
const User = require('../models/User');
const { createNotification } = require('../utils/createNotification');

function buildRoom(userA, userB) {
  return [userA.toString(), userB.toString()].sort().join('_');
}

const getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate('sender', 'name profileImage')
      .populate('receiver', 'name profileImage')
      .populate('product', 'title images price')
      .sort({ createdAt: -1 });

    const seen = new Map();

    messages.forEach((message) => {
      const partner =
        message.sender._id.toString() === req.user._id.toString()
          ? message.receiver
          : message.sender;

      if (!seen.has(partner._id.toString())) {
        seen.set(partner._id.toString(), {
          room: message.room,
          user: partner,
          latestMessage: message,
        });
      }
    });

    res.json(Array.from(seen.values()));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching conversations' });
  }
};

const getMessagesByUser = async (req, res) => {
  try {
    const partner = await User.findById(req.params.userId).select('name profileImage');
    if (!partner) {
      return res.status(404).json({ message: 'Conversation user not found' });
    }

    const room = buildRoom(req.user._id, partner._id);
    const messages = await Message.find({ room })
      .populate('sender', 'name profileImage')
      .populate('receiver', 'name profileImage')
      .populate('product', 'title images price')
      .sort({ createdAt: 1 });

    await Message.updateMany(
      { room, receiver: req.user._id, read: false },
      { $set: { read: true } }
    );

    res.json({ room, partner, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching messages' });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { receiver, content, product } = req.body;

    if (!receiver || !content) {
      return res.status(400).json({ message: 'Receiver and content are required' });
    }

    const receiverUser = await User.findById(receiver);
    if (!receiverUser) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    const room = buildRoom(req.user._id, receiver);
    const message = await Message.create({
      sender: req.user._id,
      receiver,
      product: product || null,
      content,
      room,
    });

    const populated = await Message.findById(message._id)
      .populate('sender', 'name profileImage')
      .populate('receiver', 'name profileImage')
      .populate('product', 'title images price');

    await createNotification(
      receiver,
      'New message',
      `${req.user.name} sent you a new message.`,
      'message',
      `/chat/${req.user._id}`
    );

    if (req.app.get('io')) {
      req.app.get('io').to(room).emit('receive_message', populated);
      req.app.get('io').to(receiver.toString()).emit('notification', {
        type: 'message',
        title: 'New message',
        message: `${req.user.name} sent you a new message.`,
        link: `/chat/${req.user._id}`,
      });
    }

    res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error sending message' });
  }
};

module.exports = {
  getConversations,
  getMessagesByUser,
  sendMessage,
};
