const Notification = require('../models/Notification');

async function createNotification(user, title, message, type = 'system', link = '/') {
  return Notification.create({
    user,
    title,
    message,
    type,
    link,
  });
}

module.exports = { createNotification };
