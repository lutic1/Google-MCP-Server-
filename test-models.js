const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testModels() {
  const apiKey = process.env.GEMINI_API_KEY || 'put api key here';
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const modelsToTest = [
    'gemini-1.5-flash',
    'gemini-1.5-pro', 
    'gemini-pro',
    'models/gemini-1.5-flash',
    'models/gemini-1.5-pro'
  ];
  
  for (const modelName of modelsToTest) {
    try {
      console.log(`
🔄 Testing model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const result = await model.generateContent('Say hello');
      const response = result.response.text();
      
      console.log(`✅ SUCCESS with ${modelName}!`);
      console.log(`Response: ${response}`);
      break;
      
    } catch (error) {
      console.log(`❌ FAILED with ${modelName}: ${error.message}`);
    }
  }
}

testModels().catch(console.error);
