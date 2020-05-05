const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    emailConfirmed: { type: Boolean, required: true, default: false },
    emailConfirmedAt: { type: Date },
    salt: { type: String, required: true },
    hash: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    country: { type: String, required: true },
    region: { type: String, required: true },
    avatar: { type: String },
    interests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
    admin: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
};

UserSchema.methods.validatePassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
  return this.hash === hash;
};

UserSchema.methods.generateJWT = function () {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      _id: this._id,
      admin: this.admin,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
    },
    process.env.JWT_SECRET
  );
};

UserSchema.methods.toAuthJson = function () {
  return { accessToken: this.generateJWT() };
};

UserSchema.methods.toJson = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    emailConfirmed: this.emailConfirmed,
    emailConfirmedAt: this.emailConfirmedAt,
    dateOfBirth: this.dateOfBirth,
    country: this.country,
    region: this.region,
    avatar: this.avatar,
    interests: this.interests,
    admin: this.admin,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model('User', UserSchema);
