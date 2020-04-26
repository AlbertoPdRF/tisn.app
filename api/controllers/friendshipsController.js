const Friendship = require('../models/Friendship');

exports.get = (req, res, next) => {
  const id = req.params.userId;
  return Friendship.find()
    .or([{ requestant: id }, { receivant: id }])
    .populate({
      path: 'requestant',
      select: 'name avatar interests',
      populate: {
        path: 'interests',
        model: 'Interest',
        select: 'name avatar',
      },
    })
    .populate({
      path: 'receivant',
      select: 'name avatar interests',
      populate: {
        path: 'interests',
        model: 'Interest',
        select: 'name avatar',
      },
    })
    .then((friendships) => res.json({ friendships }));
};

exports.post = (req, res, next) => {
  const {
    body: { friendship },
  } = req;

  if (friendship.accepted) {
    return res.status(403).json({
      errors: [
        {
          param: 'Permissions',
          msg: "aren't enough",
        },
      ],
    });
  }

  const finalFriendship = new Friendship(friendship);

  return finalFriendship
    .save()
    .then(() => res.json({ friendship: finalFriendship }));
};

exports.putId = (req, res, next) => {
  const {
    body: { friendship },
  } = req;

  Friendship.findOneAndUpdate(
    {
      _id: req.params.friendshipId,
      receivant: req.payload._id,
    },
    friendship,
    { new: true }
  ).then((updatedFriendship) => {
    if (!updatedFriendship) {
      return res.sendStatus(404);
    }

    res.json({ friendship: updatedFriendship });
  });
};

exports.deleteId = (req, res, next) => {
  return Friendship.findByIdAndRemove(req.params.friendshipId).then(
    (friendship) => {
      if (!friendship) {
        return res.sendStatus(404);
      }

      res.json({ friendship });
    }
  );
};
