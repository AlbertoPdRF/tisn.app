const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TokenSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true, enum: ['Email'] },
    token: { type: String, required: true },
  },
  { timestamps: true }
);

TokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('Token', TokenSchema);
