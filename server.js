// RISQ AI BACKEND - UPDATED VERSION
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ========== ADD THESE ROUTES ==========

// Health check - MUST HAVE THIS
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'RISQ AI Backend',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint - MUST HAVE THIS
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'API is working perfectly!',
    timestamp: new Date().toISOString()
  });
});

// Home page
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 RISQ AI Backend is RUNNING!',
    endpoints: {
      health: '/health',
      test: '/api/test',
      chat: '/api/chat (POST)'
    },
    instructions: 'Use POST /api/chat with { "message": "your text" } for AI responses',
    timestamp: new Date().toISOString()
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || message.trim() === '') {
      return res.status(400).json({ 
        error: 'Message is required',
        example: { "message": "Hello, how are you?" }
      });
    }
    
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      return res.json({
        response: "🔧 Setup Required: Add OPENAI_API_KEY in Render Environment Variables",
        note: "Once added, I'll be able to provide AI responses!",
        timestamp: new Date().toISOString()
      });
    }
    
    // Import OpenAI here (dynamic import for Render compatibility)
    const { Configuration, OpenAIApi } = await import('openai');
    
    const configuration = new Configuration({
      apiKey: apiKey
    });
    
    const openai = new OpenAIApi(configuration);
    
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are RISQ AI, a helpful and intelligent AI assistant created by a user. Provide clear, accurate, and helpful responses."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });
    
    const aiResponse = completion.data.choices[0].message.content;
    
    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    
    let errorMessage = "Sorry, I encountered an error. Please try again.";
    
    if (error.response?.status === 401) {
      errorMessage = "Invalid API key. Check OPENAI_API_KEY in Render Environment.";
    } else if (error.response?.status === 429) {
      errorMessage = "Too many requests. Please wait a moment.";
    }
    
    res.status(500).json({
      success: false,
      response: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    available: ['/', '/health', '/api/test', '/api/chat (POST)'],
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ RISQ AI Backend running on port ${PORT}`);
  console.log(`🌐 Health: http://localhost:${PORT}/health`);
  console.log(`🔧 Test: http://localhost:${PORT}/api/test`);
});
