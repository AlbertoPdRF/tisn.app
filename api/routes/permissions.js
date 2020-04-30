const permissions = (req, res, next) => {
  const { baseUrl, method, params, payload, body } = req;

  let id;
  if (baseUrl.startsWith('/api/users')) {
    if (baseUrl.endsWith('/friendships')) {
      if (method === 'GET') {
        id = payload._id;
      } else {
        if (
          (body.friendship.accepted || body.friendship.acceptedAt) &&
          method !== 'DELETE'
        ) {
          id = body.friendship.receivant._id;
        } else {
          if (
            body.friendship.requestant._id === payload._id ||
            body.friendship.receivant._id === payload._id
          ) {
            id = payload._id;
          }
        }
      }
    } else {
      id = params.userId;
    }
  } else if (baseUrl.startsWith('/api/events')) {
    if (baseUrl.endsWith('/attendants')) {
      id = body.attendant.user._id;
    } else if (baseUrl.endsWith('/comments')) {
      id = body.comment.user._id;
    } else {
      id = body.event.createdBy;
    }
  }

  if (payload._id === id || payload.admin) {
    next();
  } else {
    res.status(403).json({
      errors: [
        {
          param: 'Permissions',
          msg: "aren't enough",
        },
      ],
    });
  }
};

module.exports = permissions;
