// RISQ AI BACKEND - Copy ALL code below
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple test route
app.get('/', (req, res) => {
  res.send('✅ RISQ AI Backend is RUNNING!');
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Your OpenAI API Key from environment
    const apiKey = process.env.OPENAI_API_KEY;
    
    // If no key in environment, check request
    const configuration = new Configuration({
      apiKey: apiKey
    });
    
    const openai = new OpenAIApi(configuration);
    
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are RISQ AI, a helpful AI assistant created by a user. Be friendly, helpful, and concise."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500
    });
    
    const aiResponse = completion.data.choices[0].message.content;
    
    res.json({
      success: true,
      response: aiResponse
    });
    
  } catch (error) {
    console.log('Error:', error.message);
    res.json({
      success: false,
      response: "Sorry, I'm having trouble right now. Please try again."
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 RISQ AI Server running at http://localhost:${PORT}`);
});