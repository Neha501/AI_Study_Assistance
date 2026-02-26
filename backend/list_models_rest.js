const axios = require("axios");
require("dotenv").config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await axios.get(url);
        console.log("Available Models via REST:");
        response.data.models.forEach(m => {
            console.log(`- ${m.name}`);
        });
    } catch (error) {
        console.error("Error calling REST API:", error.response ? error.response.data : error.message);
    }
}

listModels();
