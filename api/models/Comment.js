const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    parentComment: { type: Schema.Types.ObjectId, ref: 'Comment' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', CommentSchema);
