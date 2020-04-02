const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const InterestSchema = new Schema({
  name: {type: String, required: true},
  avatar: {type: String, required: true},
  category: {type: Schema.Types.ObjectId, ref: 'Category', required: true}
});

module.exports = mongoose.model('Interest', InterestSchema);
