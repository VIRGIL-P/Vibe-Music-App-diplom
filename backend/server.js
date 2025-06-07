import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

if (!process.env.OPENROUTER_API_KEY) {
  console.error("❌ OPENROUTER_API_KEY не найден в .env файле!");
  process.exit(1);
}

app.post('/api/ask', async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is missing or invalid.' });
  }

  try {
    console.log("📨 Запрос от клиента:", message);

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Ты музыкальный эксперт и рекомендатель треков.' },
          { role: 'user', content: message },
        ],
        temperature: 0.8,
        max_tokens: 200,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0].message.content;
    console.log("✅ Ответ от OpenRouter:", content);
    res.json({ content });
  } catch (error) {
    console.error("❌ Ошибка при обращении к OpenRouter:");
    if (error.response) {
      console.error("📡 Status:", error.response.status);
      console.error("📄 Data:", error.response.data);
    } else {
      console.error("📛 Message:", error.message || error);
    }
    res.status(500).json({ error: 'Failed to get response from OpenRouter.' });
  }
});

app.listen(port, () => {
  console.log(`🚀 AI-сервер через OpenRouter запущен на http://localhost:${port}`);
});
