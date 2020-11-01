const Notification = require('../models/Notification');
const Token = require('../models/Token');

const crypto = require('crypto');
const sendgrid = require('@sendgrid/mail');
const fs = require('fs').promises;
const path = require('path');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const dbBackup = async (filename) => {
	const destination = path.join(__dirname, `../db/dumps/${filename}`);

	const attachment = await fs.readFile(destination, { encoding: 'base64' });

	const email = {
		to: 'admin@tisn.app',
		from: { email: 'no-reply@tisn.app', name: 'Tisn' },
		subject: 'Database backup',
		text: `Find attached today's database backup: "${filename}".`,
		attachments: [
			{
				content: attachment,
				filename,
				type: 'application/gzip',
				disposition: 'attachment',
			},
		],
	};

	sendgrid.send(email).then(() => fs.unlink(destination, () => {}));
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
	dbBackup,
};

module.exports = emails;
