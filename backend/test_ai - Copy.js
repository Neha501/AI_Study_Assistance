const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const modelsToTest = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-flash-latest", "gemini-1.5-flash"];

async function testModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    for (const modelName of modelsToTest) {
        console.log(`Testing model: ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello, are you active?");
            console.log(`✅ ${modelName} is working!`);
            process.exit(0); // Exit on first working model
        } catch (error) {
            console.error(`❌ ${modelName} failed: ${error.message}`);
        }
    }
    console.log("No models are currently working with this API key.");
    process.exit(1);
}

testModels();
