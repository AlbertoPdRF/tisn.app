const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      required: true,
      enum: [
        'confirmEmail',
        'createEvent',
        'uploadAvatar',
        'selectInterests',
        'newAttendant',
        'newComment',
        'newFriendshipRequest',
        'acceptedFriendshipRequest',
        'newMessage',
      ],
    },
    referencedUser: { type: Schema.Types.ObjectId, ref: 'User' },
    referencedEvent: { type: Schema.Types.ObjectId, ref: 'Event' },
    referencedFriendship: { type: Schema.Types.ObjectId, ref: 'Friendship' },
    read: { type: Boolean, required: true, default: false },
    readAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);
