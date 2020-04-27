const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FriendshipSchema = new Schema(
  {
    requestant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receivant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    accepted: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Friendship', FriendshipSchema);
