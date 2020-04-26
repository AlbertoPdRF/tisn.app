const permissions = (req, res, next) => {
  const { baseUrl, params, payload, body } = req;

  let id;
  if (baseUrl.startsWith('/api/users')) {
    if (baseUrl.endsWith('/friendships')) {
      if (params.userId === body.friendship.requestant) {
        id = body.friendship.receivant;
      } else {
        if (body.friendship.accepted) {
          id = body.friendship.receivant;
        } else {
          if (
            body.friendship.requestant === payload._id ||
            body.friendship.receivant === payload._id
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
      id = body.attendant.user;
    } else if (baseUrl.endsWith('/comments')) {
      id = body.comment.user;
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
