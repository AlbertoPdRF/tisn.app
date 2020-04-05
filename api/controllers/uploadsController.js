const path = require('path');

const uploadsPath = path.join(__dirname, '../uploads');

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
    await req.files.file.mv(destination);
    res.json({ path: `/uploads/${fileName}` });
  } catch (error) {
    res.status(400);
    res.json({ error: error.message });
  }
};
