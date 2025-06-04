// routes/uploadRoute.js
const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const router = express.Router();

require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'video',
      folder: 'vibe/audio',
    });

    fs.unlinkSync(filePath); // Удаляем файл с сервера

    return res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error('Ошибка при загрузке файла:', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
