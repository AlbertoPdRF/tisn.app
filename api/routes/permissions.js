const permissions = (req, res, next) => {
  const { payload } = req;

  let id;
  if (req.baseUrl === '/api/users') {
    id = req.params.id;
  } else if (req.baseUrl === '/api/events') {
    id = req.body.event.createdBy;
  }

  if (payload._id === id || payload.admin) {
    next();
  } else {
    res.status(403).json({
      error: 'not enough permissions to perform the requested action'
    });
  }
};

module.exports = permissions
