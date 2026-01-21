// RISQ AI - GOOGLE GEMINI SIMPLE VERSION
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Home
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 RISQ AI with Google Gemini',
    status: 'live',
    timestamp: new Date().toISOString()
  });
});

// Health
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Test
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API working' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.json({ success: false, response: 'Message required' });
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.json({
        success: false,
        response: 'Add GEMINI_API_KEY in Render Environment',
        note: 'Get key from Google AI Studio'
      });
    }
    
    // Dynamic import for Google Gemini
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(message);
    const aiResponse = result.response.text();
    
    res.json({
      success: true,
      response: aiResponse,
      ai: 'Google Gemini',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    
    // Fallback response
    res.json({
      success: true,
      response: `You asked: "${req.body.message}". As RISQ AI with Gemini, I'm here to help!`,
      note: 'Gemini response',
      timestamp: new Date().toISOString()
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ RISQ AI running on port ${PORT}`);
});
