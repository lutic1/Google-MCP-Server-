import { GoogleGenerativeAI } from '@google/generative-ai';

async function testSpecificModel() {
  const apiKey = 'put api key here';
  const modelName = 'gemini-2.5-pro-exp-03-25';
  
  console.log('🔑 Testing with API Key:', apiKey.substring(0, 20) + '...');
  console.log('🤖 Testing model:', modelName);
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });
    
    const result = await model.generateContent('Hello! Please respond with a short greeting.');
    const response = result.response.text();
    
    console.log('✅ SUCCESS!');
    console.log('Response:', response.trim());
    console.log('
🎉 Model', modelName, 'is working correctly!');
    
  } catch (error) {
    console.log('❌ FAILED:', error.message);
  }
}

testSpecificModel().catch(console.error);
