import { GoogleGenerativeAI } from '@google/generative-ai';

async function testModels() {
  const apiKey = process.env.GEMINI_API_KEY || 'put api key here';
  console.log('🔑 Using API Key:', apiKey.substring(0, 20) + '...');
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const modelsToTest = [
    'gemini-1.5-flash',
    'gemini-1.5-pro', 
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro-latest',
    'gemini-pro'
  ];
  
  for (const modelName of modelsToTest) {
    try {
      console.log('
🔄 Testing model:', modelName);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const result = await model.generateContent('Say hello in one word');
      const response = result.response.text();
      
      console.log('✅ SUCCESS with', modelName + '!');
      console.log('Response:', response.trim());
      console.log('
🎉 Use this model name in your MCP server:', modelName);
      break;
      
    } catch (error) {
      const errorMsg = error.message.split('
')[0];
      console.log('❌ FAILED with', modelName + ':', errorMsg);
    }
  }
}

testModels().catch(console.error);
