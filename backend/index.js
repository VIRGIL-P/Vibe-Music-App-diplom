const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const aiRouter = require('./routes/ai');
const uploadRouter = require('./routes/upload');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', aiRouter);             // AI маршруты
app.use('/api/upload', uploadRouter);  // Загрузка файлов

// Запуск сервера
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
