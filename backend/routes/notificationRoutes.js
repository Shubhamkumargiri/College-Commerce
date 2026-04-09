const express = require('express');
const { protect } = require('../middleware/auth');
const { getNotifications, markNotificationRead } = require('../controllers/notificationController');

const router = express.Router();

router.use(protect);
router.get('/', getNotifications);
router.put('/:id/read', markNotificationRead);

module.exports = router;
