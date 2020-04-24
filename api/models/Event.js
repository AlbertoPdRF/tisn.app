const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EventSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    relatedInterests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
    coverPhoto: { type: String },
    attendantsLimit: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', EventSchema);
