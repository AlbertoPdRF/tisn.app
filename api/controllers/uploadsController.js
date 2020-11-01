const path = require('path');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.post = async (req, res, next) => {
	const file = req.files.file;

	if (!file.mimetype.match(/image.*/)) {
		return res.status(422).json({
			errors: [
				{
					param: 'upload.fileType',
					msg: 'is invalid',
				},
			],
		});
	}

	const md5CheckSum = file.md5;
	const uploadsPath = path.join(__dirname, '../uploads');
	const destination = path.join(uploadsPath, md5CheckSum);
	try {
		await file.mv(destination);
		const uploadedFile = await cloudinary.uploader.upload(destination);
		fs.unlink(destination, () => {});
		res.json({ uploadedFile });
	} catch (error) {
		res.status(400);
		res.json({ error: error.message });
	}
};
