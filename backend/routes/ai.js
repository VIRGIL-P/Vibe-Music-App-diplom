const express = require('express');
const axios = require('axios');

const router = express.Router();

router.post('/ask', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:8080/', // или твой домен
          'X-Title': 'Vibe Music Assistant'
        },
      }
    );

    res.json(response.data.choices[0].message);
  } catch (error) {
    console.error('AI Error (OpenRouter):', error?.response?.data || error.message);
    res.status(500).json({ error: 'AI request failed' });
  }
});

module.exports = router;
