const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getConversations,
  getMessagesByUser,
  sendMessage,
} = require('../controllers/messageController');

const router = express.Router();

router.use(protect);
router.get('/', getConversations);
router.post('/', sendMessage);
router.get('/:userId', getMessagesByUser);

module.exports = router;
