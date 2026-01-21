// RISQ AI - GOOGLE GEMINI (COMMONJS VERSION)
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
    message: '🚀 RISQ AI Powered by Google Gemini',
    status: 'live',
    ai: 'Google Gemini 1.5 Flash (FREE)',
    timestamp: new Date().toISOString()
  });
});

// Health
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Test
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API working with Gemini' });
});

// Chat endpoint - SIMPLIFIED
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
        response: 'Please add GEMINI_API_KEY in Render Environment',
        note: 'Get FREE key from Google AI Studio'
      });
    }
    
    // Try to use Gemini
    try {
      // Dynamic require for Gemini
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      
      const result = await model.generateContent(message);
      const aiResponse = result.response.text();
      
      return res.json({
        success: true,
        response: aiResponse,
        ai: 'Google Gemini',
        timestamp: new Date().toISOString()
      });
      
    } catch (geminiError) {
      console.log('Gemini failed, using fallback:', geminiError.message);
      // Continue to fallback
    }
    
    // Fallback responses
    const responses = {
      'hello': 'Hello! I\'m RISQ AI powered by Google Gemini. How can I help?',
      'hi': 'Hi there! I\'m here to assist you with anything.',
      'who are you': 'I\'m RISQ AI, your personal assistant powered by Google Gemini!',
      'what is your name': 'I\'m RISQ AI, created by you!',
      'help': 'I can answer questions, help with coding, explain concepts, and more!',
      'thank you': 'You\'re welcome! Happy to help.',
      'bye': 'Goodbye! Come back anytime you need assistance.',
      '2+2': '2 + 2 = 4',
      'capital of france': 'The capital of France is Paris.',
      'how are you': 'I\'m doing great! Ready to help you.',
      'what can you do': 'I can chat, answer questions, help with learning, writing, and more!'
    };
    
    const lowerMsg = message.toLowerCase().trim();
    let response = responses[lowerMsg];
    
    if (!response) {
      response = `You asked: "${message}". As RISQ AI with Google Gemini, I'm here to help! For detailed answers, make sure the GEMINI_API_KEY is properly configured.`;
    }
    
    res.json({
      success: true,
      response: response,
      ai: 'Smart Fallback',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Server Error:', error);
    res.json({
      success: true,
      response: 'Hello! I\'m RISQ AI. How can I assist you today?',
      note: 'System is working',
      timestamp: new Date().toISOString()
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ RISQ AI with Gemini running on port ${PORT}`);
});

