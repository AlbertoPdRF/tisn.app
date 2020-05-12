const Notification = require('../models/Notification');
const Token = require('../models/Token');

const crypto = require('crypto');
const sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const emailConfirmation = (user) => {
  Notification.findOne(
    { user, type: 'confirmEmail' },
    {},
    { sort: { _id: -1 } }
  ).then((notification) => {
    if (!notification || notification.read) {
      const emailNotification = new Notification({
        user,
        type: 'confirmEmail',
      });

      emailNotification.save();
    }
  });

  const token = new Token({
    user,
    type: 'Email',
    token: crypto.randomBytes(16).toString('hex'),
  });

  token.save().then(() => {
    const email = {
      to: user.email,
      from: { email: 'no-reply@tisn.app', name: 'Tisn' },
      subject: 'Confirm your email address',
      text: `
          Welcome to Tisn, ${user.name}!

          Please confirm your email address navigating to ${process.env.BASE_CLIENT_URL}/users/${user._id}/confirm-email?token=${token.token}

          Best regards,
          The Tisn team
        `,
      html: `
          <p>Welcome to Tisn, ${user.name}!</p>
          <p>
            Please confirm your email address navigating to
            <a href=${process.env.BASE_CLIENT_URL}/users/${user._id}/confirm-email?token=${token.token}>
              ${process.env.BASE_CLIENT_URL}/users/${user._id}/confirm-email?token=${token.token}
            </a>
          </p>
          <p>
            Best regards,<br/>
            The Tisn team
          </p>
        `,
    };

    sendgrid.send(email);
  });
};

const emails = {
  emailConfirmation,
};

module.exports = emails;
