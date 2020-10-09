const Notification = require('../models/Notification');
const Token = require('../models/Token');
const crypto = require('crypto');
const sendgrid = require('@sendgrid/mail');
const fs = require('fs');
const path = require('path');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const emailDatabaseBackup = (filename) => {
  try {
    let attachment = fs
      .readFileSync(path.resolve(__dirname, `../dump/${filename}`))
      .toString('base64');

    // Retrieve email address of the admin
    const getAdminEmail = () => {
      require('dotenv').config();
      return process.env.ADMIN_EMAIL;
    };

    let adminEmail = getAdminEmail();

    // Ensure that the email address is set
    if (adminEmail == undefined || adminEmail == '') {
      return 0;
    }

    // Create message
    let message = {
      to: adminEmail,
      from: { email: 'jackeblagare@gmail.com', name: 'Tisn' },
      subject: 'TISN APP - Database Backup',
      text: 'Attached is the database dump ' + filename + '.',
      attachments: [
        {
          content: attachment,
          filename: filename,
          type: 'application/gzip',
          disposition: 'attachment',
        },
      ],
    };

    console.log('Now sending email...');

    if (process.env.NODE_ENV === 'production') {
      sendgrid
        .send(message)
        .then(() => {
          console.log('Email sent successfully ...');
        })
        .catch((error) => {
          console.log('Email not sent successfully ...');
          console.error(error);
          return 0;
        });
    }

    return 1;
  } catch (e) {
    console.log(e);
    return 0;
  }
};

const emailConfirmation = (req, user) => {
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
    req.i18n.changeLanguage(user.preferredLocale);

    const email = {
      to: user.email,
      from: { email: 'no-reply@tisn.app', name: 'Tisn' },
      subject: req.t('emails.emailConfirmation.subject'),
      text: `
          ${req.t('emails.emailConfirmation.welcome', { name: user.name })}

          ${req.t('emails.emailConfirmation.confirm')} ${
        process.env.BASE_CLIENT_URL
      }/users/${user._id}/confirm-email?token=${token.token}

          ${req.t('emails.emailConfirmation.regards')},
          ${req.t('emails.emailConfirmation.tisn')}
        `,
      html: `
          <p>
            ${req.t('emails.emailConfirmation.welcome', {
              name: user.name,
            })}
          </p>
          <p>
            ${req.t('emails.emailConfirmation.confirm')} <a href=${
        process.env.BASE_CLIENT_URL
      }/users/${user._id}/confirm-email?token=${token.token}>
              ${process.env.BASE_CLIENT_URL}/users/${
        user._id
      }/confirm-email?token=${token.token}
            </a>
          </p>
          <p>
            ${req.t('emails.emailConfirmation.regards')},<br/>
            ${req.t('emails.emailConfirmation.tisn')}
          </p>
        `,
    };

    process.env.NODE_ENV === 'production'
      ? sendgrid.send(email)
      : console.log(email);
  });
};

const emails = {
  emailConfirmation,
  emailDatabaseBackup,
};

module.exports = emails;
