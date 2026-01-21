// RISQ AI BACKEND - SIMPLIFIED VERSION
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'RISQ AI Backend',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// Home page
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 RISQ AI Backend is RUNNING!',
    endpoints: ['/health', '/api/test', '/api/chat (POST)'],
    timestamp: new Date().toISOString()
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return res.json({
        response: "🔧 Add OPENAI_API_KEY in Render Environment Variables",
        note: "Get API key from https://platform.openai.com/api-keys"
      });
    }
    
    const configuration = new Configuration({
      apiKey: apiKey
    });
    
    const openai = new OpenAIApi(configuration);
    
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are RISQ AI, a helpful AI assistant. Be clear and helpful."
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
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      response: "Sorry, I'm having trouble. Please try again."
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ RISQ AI Backend running on port ${PORT}`);
});
