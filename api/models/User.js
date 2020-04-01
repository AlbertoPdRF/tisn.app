const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  hash: {type: String, required: true},
  salt: {type: String, required: true},
  dateOfBirth: {type: Date, required: true},
  interests: [{type: Schema.Types.ObjectId, ref: 'Interest'}],
  admin: {type: Boolean, required: true, default: false}
}, { timestamps: true });

UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10)
  }, process.env.JWT_SECRET);
}

UserSchema.methods.toAuthJSON = function() {
  return {
    id: this._id,
    name: this.name,
    admin: this.admin,
    accessToken: this.generateJWT()
  };
};

module.exports = mongoose.model('User', UserSchema);
