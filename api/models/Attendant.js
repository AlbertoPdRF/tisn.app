const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AttendeeSchema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Attendee', AttendeeSchema);
