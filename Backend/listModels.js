const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: "Say Hello in Spanish." }] }],
    });

    console.log("✅ Gemini API Response:", result.response.text());
  } catch (error) {
    console.error("🚨 Error calling Gemini API:", error.message);
  }
}

testGemini();
