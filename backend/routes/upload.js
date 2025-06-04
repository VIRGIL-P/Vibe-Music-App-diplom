const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { Readable } = require('stream');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer конфигурация (в память)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Загрузка изображения
router.post('/image', upload.single('file'), async (req, res) => {
  try {
    const result = await streamUpload(req.file.buffer, 'vibe/images');
    res.json({ secure_url: result.secure_url });
  } catch (err) {
    console.error('❌ Image upload error:', err.message);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

// Загрузка аудио
router.post('/audio', upload.single('file'), async (req, res) => {
  try {
    const result = await streamUpload(req.file.buffer, 'vibe/audio', 'video');
    res.json({ secure_url: result.secure_url });
  } catch (err) {
    console.error('❌ Audio upload error:', err.message);
    res.status(500).json({ error: 'Audio upload failed' });
  }
});

// Функция для загрузки в Cloudinary через буфер
function streamUpload(buffer, folder, resource_type = 'auto') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type,
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    Readable.from(buffer).pipe(stream);
  });
}

module.exports = router;
