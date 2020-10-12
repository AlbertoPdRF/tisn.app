const Friendship = require('../models/Friendship');
const Message = require('../models/Message');
const User = require('../models/User');

let displayLogs;

const createMessage = async (messageParams) => {
  const message = new Message({
    friendship: messageParams.friendship,
    user: messageParams.user,
    content: messageParams.content,
  });
  message.save();

  if (displayLogs) {
    console.log('\n', '\x1b[0m', `New message created: ${message}`);
  }
  return message;
};

const createMessages = async (verbose) => {
  console.log('\n', '\x1b[0m', 'Populating messages collection...');
  displayLogs = verbose;

  const usersArray = await User.find();
  const friendshipsArray = await Friendship.find();

  // For each friendship, generate 0 to 9 messages
  // Switching user between requestant and receivant
};

module.exports = { createMessages };
