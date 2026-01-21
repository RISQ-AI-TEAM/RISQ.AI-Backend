// RISQ AI - OPENAI v3 COMPATIBLE
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Home
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 RISQ AI Backend is RUNNING!',
    status: 'live',
    timestamp: new Date().toISOString()
  });
});

// Health
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'RISQ AI',
    timestamp: new Date().toISOString()
  });
});

// Test
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// Chat endpoint - OPENAI v3
app.post('/api/chat', async (req, res) => {
  console.log('Chat request received');
  
  try {
    const { message } = req.body;
    
    if (!message || message.trim() === '') {
      return res.status(400).json({ 
        error: 'Message is required',
        example: { message: "Hello" }
      });
    }
    
    // Get API key
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey || apiKey === 'your_key_here') {
      return res.json({
        success: false,
        response: "🔧 Please add OPENAI_API_KEY to Render Environment Variables",
        note: "Get key from https://platform.openai.com/api-keys"
      });
    }
    
    console.log('API Key found, calling OpenAI...');
    
    // OPENAI v3 syntax
    const configuration = new Configuration({
      apiKey: apiKey
    });
    
    const openai = new OpenAIApi(configuration);
    
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are RISQ AI, a helpful AI assistant created by a user. Be friendly, clear, and helpful."
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
    
    console.log('Response generated successfully');
    
    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('OpenAI Error:', error.message);
    console.error('Full error:', error);
    
    let errorMessage = "Sorry, I encountered an error. Please try again.";
    
    if (error.response?.status === 401) {
      errorMessage = "Invalid API key. Please check your OpenAI API key in Render Environment.";
    } else if (error.response?.status === 429) {
      errorMessage = "Rate limit exceeded. Please wait a moment.";
    } else if (error.message.includes('Configuration')) {
      errorMessage = "Server configuration error. Please check OpenAI package version.";
    }
    
    res.status(500).json({
      success: false,
      response: errorMessage,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ RISQ AI Backend running on port ${PORT}`);
  console.log(`📡 Health endpoint: http://localhost:${PORT}/health`);
  console.log(`🤖 Chat endpoint: POST http://localhost:${PORT}/api/chat`);
});
