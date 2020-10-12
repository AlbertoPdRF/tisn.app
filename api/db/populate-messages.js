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
  // Switching user between requestant and receivant and updating the lastMessageAt
  for (const friendship of friendshipsArray) {
    const messagesCount = Math.floor(Math.random() * 10);

    for (let i = 0; i < messagesCount; i++) {
      const user =
        Math.random() < 0.5 ? friendship.requestant : friendship.receivant;

      const messageParams = {
        friendship,
        user,
      };
    }
  }
};

module.exports = { createMessages };
