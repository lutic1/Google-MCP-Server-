#!/usr/bin/env node

import { GoogleGenerativeAI } from '@google/generative-ai';

async function testGeminiConnection() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY environment variable is not set');
    console.log('Please set it with: export GEMINI_API_KEY="your-api-key"');
    process.exit(1);
  }
  
  console.log('✅ API Key found');
  console.log('🔄 Testing Gemini API connection...');
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // First, let's list available models
    console.log('📋 Checking available models...');
    
    // Try the newer model name
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: 'Hello, respond with just "Connection successful!"' }] }],
      generationConfig: {
        maxOutputTokens: 10,
        temperature: 0.1,
      },
    });
    
    const response = result.response.text();
    console.log('✅ Gemini API Response:', response);
    console.log('✅ Connection test passed with gemini-1.5-flash!');
    
  } catch (error) {
    console.error('❌ Gemini API Error with gemini-1.5-flash:', error.message);
    
    // Try alternative model names
    try {
      console.log('🔄 Trying gemini-1.5-pro...');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      
      const result = await model.generateContent('Hello, respond with just "Connection successful!"');
      const response = result.response.text();
      console.log('✅ Gemini API Response:', response);
      console.log('✅ Connection test passed with gemini-1.5-pro!');
      
    } catch (error2) {
      console.error('❌ Gemini API Error with gemini-1.5-pro:', error2.message);
      
      if (error2.message.includes('API_KEY_INVALID')) {
        console.log('💡 Your API key appears to be invalid. Please check:');
        console.log('   - Go to https://aistudio.google.com/app/apikey');
        console.log('   - Create a new API key');
        console.log('   - Make sure you copied it correctly');
      } else if (error2.message.includes('quota')) {
        console.log('💡 You may have exceeded your API quota');
      } else {
        console.log('💡 Available models may be different. Check the Google AI Studio documentation.');
      }
      
      process.exit(1);
    }
  }
}

testGeminiConnection();
