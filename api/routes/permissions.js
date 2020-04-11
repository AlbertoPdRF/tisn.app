const permissions = (req, res, next) => {
  const { payload } = req;

  if (req.params.id === payload._id || payload.admin) {
    next();
  } else {
    res.status(403).json({
      error: 'not enough permissions to perform the requested action'
    });
  }
};

module.exports = permissions
