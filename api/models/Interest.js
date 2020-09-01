const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const InterestSchema = new Schema({
  name: { type: String, required: true },
  avatar: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: [
      'Entertainment',
      'Fitness and wellness',
      'Hobbies and activities',
      'Industry and business',
      'Shopping and fashion',
      'Sports',
    ],
  },
});

module.exports = mongoose.model('Interest', InterestSchema);
