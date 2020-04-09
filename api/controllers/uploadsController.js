const path = require('path');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const uploadsPath = path.join(__dirname, '../uploads');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.post = async (req, res, next) => {
  const file = req.files.file;

  const extension = path.extname(file.name);
  if (extension !== '.jpg' && extension !== '.jpeg' && extension !== '.png' && extension !== '.gif' && extension !== '.svg') {
    res.status(400);
    res.json({ error: 'invalid file type' });
  }

  const md5CheckSum = file.md5;
  const fileName = md5CheckSum + extension;
  const destination = path.join(uploadsPath, fileName);
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
