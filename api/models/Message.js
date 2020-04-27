const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    friendship: {
      type: Schema.Types.ObjectId,
      ref: 'Friendship',
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', MessageSchema);
