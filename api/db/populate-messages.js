const { getParagraph } = require('./utils');
const { createNotification } = require('./populate-notifications');

const Friendship = require('../models/Friendship');
const Message = require('../models/Message');

let displayLogs;

const createMessage = async (messageParams) => {
  const message = new Message({
    friendship: messageParams.friendship,
    user: messageParams.user,
    content: messageParams.content,
  });
  await message.save();

  const user =
    message.friendship.receivant.toString() === message.user.toString()
      ? message.friendship.receivant
      : message.friendship.requestant;
  await createNotification({
    user,
    type: 'newMessage',
    read: false,
    referencedUser: message.user,
    referencedFriendship: message.friendship,
  });

  if (displayLogs) {
    console.log('\n', '\x1b[0m', `New message created: ${message}`);
  }
  return message;
};

const createMessages = async (verbose) => {
  console.log('\n', '\x1b[0m', 'Populating messages collection...');
  displayLogs = verbose;

  const friendshipsArray = await Friendship.find();
  const messagesArray = [];

  for (const friendship of friendshipsArray) {
    const messagesCount = Math.floor(Math.random() * 25);

    for (let i = 0; i < messagesCount; i++) {
      const user =
        Math.random() < 0.5 ? friendship.requestant : friendship.receivant;
      const content = getParagraph();

      const messageParams = {
        friendship,
        user,
        content,
      };

      messagesArray.push(await createMessage(messageParams));
    }

    if (messagesCount > 0) {
      friendship.lastMessageAt = new Date();
      await friendship.save();
    }
  }

  console.log('\x1b[32m', `Created ${messagesArray.length} messages`);
};

module.exports = { createMessages };
