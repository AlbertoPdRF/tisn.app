const permissions = (req, res, next) => {
  const { payload } = req;

  let id;
  const url = req.baseUrl;
  if (url === '/api/users') {
    id = req.params.id;
  } else if (url.startsWith('/api/events')) {
    if (url.endsWith('/attendants')) {
      id = req.body.attendant.user;
    } else {
      id = req.body.event.createdBy;
    }
  }

  if (payload._id === id || payload.admin) {
    next();
  } else {
    res.status(403).json({
      error: 'not enough permissions to perform the requested action',
    });
  }
};

module.exports = permissions;
