const getOrdinal = (n) =>
  n + (['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th');

export const buildValidationErrorsObject = (errors) => {
  const errorsObject = {};
  errors.forEach((error) => {
    let splittedError = error.param.split('.');
    let key = splittedError[1] ? splittedError[1] : splittedError[0];
    let number;
    if (key.includes('[')) {
      const splitted = key.split('[');
      key = splitted[0];
      number = parseInt(splitted[1].slice(0, -1)) + 1;
    }

    if (!errorsObject[key]) {
      if (!number) {
        errorsObject[key] = error.msg;
      } else {
        let keyToShow = key;
        if (keyToShow.startsWith('related')) {
          keyToShow = keyToShow.replace('I', ' i');
        }
        errorsObject[key] = `${getOrdinal(number)} ${keyToShow.slice(0, -1)} ${
          error.msg
        }`;
      }
    }
  });

  return errorsObject;
};

export const classifyNotifications = (notifications) => {
  const message = [];
  const regular = [];
  const regularRead = [];

  notifications.forEach((notification) => {
    if (notification.type === 'newMessage') {
      if (!notification.read && notification.referencedFriendship) {
        message.push(notification);
      }
    } else {
      if (
        notification.read ||
        ((notification.type === 'newAttendant' ||
          notification.type === 'newComment') &&
          !notification.referencedEvent)
      ) {
        regularRead.push(notification);
      } else {
        regular.push(notification);
      }
    }
  });

  return { message, regular, regularRead };
};

export const buildMessageNotificationsObject = (messageNotifications) => {
  const messageNotificationsObject = {};
  messageNotifications.forEach((notification) => {
    const key = notification.referencedFriendship._id;

    if (!messageNotificationsObject[key]) {
      messageNotificationsObject[key] = [];
    }

    messageNotificationsObject[key].push(notification);
  });

  return messageNotificationsObject;
};

export const decodeText = (text) =>
  new DOMParser().parseFromString(text, 'text/html').documentElement
    .textContent;

export const classifyFriendships = (friendships, currentUser) => {
  const pending = [];
  const accepted = [];
  let currentUserFriendship;
  friendships.forEach((friendship) => {
    if (friendship.accepted) {
      accepted.push(friendship);
    } else {
      pending.push(friendship);
    }

    if (
      friendship.requestant._id === currentUser._id ||
      friendship.receivant._id === currentUser._id
    ) {
      currentUserFriendship = friendship;
    }
  });

  return { pending, accepted, currentUserFriendship };
};

export const sortChats = (friendships) =>
  friendships.sort((a, b) => {
    const aDateTime = a.lastMessageAt ? a.lastMessageAt : a.acceptedAt;
    const bDateTime = b.lastMessageAt ? b.lastMessageAt : b.acceptedAt;

    return aDateTime < bDateTime ? 1 : aDateTime > bDateTime ? -1 : 0;
  });

export const classifyEvents = (events, referenceDate) => {
  const current = [];
  const past = [];
  events.forEach((event) => {
    if (new Date(event.startDate) >= referenceDate) {
      current.push(event);
    } else {
      past.push(event);
    }
  });

  past.reverse();
  return { current, past };
};

export const groupComments = (comments) => {
  const commentsGroups = {};
  const groupedComments = [];

  comments.forEach((comment) => {
    if (!comment.parentComment && !commentsGroups[comment._id]) {
      commentsGroups[comment._id] = [];
      groupedComments.push({
        comment,
        nestedComments: commentsGroups[comment._id],
      });
    }

    if (comment.parentComment) {
      commentsGroups[comment.parentComment].push(comment);
    }
  });

  return groupedComments.reverse();
};

export const groupInterests = (interests) => {
  const interestsGroups = {};
  const groupedInterests = [];

  interests.forEach((interest) => {
    if (!interestsGroups[interest.category.name]) {
      interestsGroups[interest.category.name] = [];
      groupedInterests.push({
        category: interest.category,
        interests: interestsGroups[interest.category.name],
      });
    }
    interestsGroups[interest.category.name].push(interest);
  });

  return groupedInterests;
};
