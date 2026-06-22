const { GoogleGenerativeAI } = require("@google/generative-ai");
const base44 = require("./base44");

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  }

  async generateText(prompt, useSearch = false) {
    try {
      if (process.env.USE_BASE44 === 'true' || !process.env.GEMINI_API_KEY) {
        return await base44.callAI(prompt);
      }

      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Text Generation Error:", error);
      try {
        return await base44.callAI(prompt);
      } catch (fallbackError) {
        throw error;
      }
    }
  }

  async generateImage(prompt) {
    try {
      // Imagen 3 requires specific API access, falling back to base44 if available
      if (process.env.USE_BASE44 === 'true') {
         return await base44.callAI(prompt, 'imagen-3'); 
      }
      throw new Error("Image generation via Gemini API is currently restricted. Please use Base44.");
    } catch (error) {
      console.error("Image Generation Error:", error);
      throw error;
    }
  }

  async generateVideo(prompt) {
    try {
      throw new Error("Video generation is currently in development.");
    } catch (error) {
      console.error("Video Generation Error:", error);
      throw error;
    }
  }

  async generateMusic(prompt) {
    try {
      throw new Error("Music generation is currently in development.");
    } catch (error) {
      console.error("Music Generation Error:", error);
      throw error;
    }
  }

  async textToSpeech(text) {
    try {
      throw new Error("TTS is currently in development.");
    } catch (error) {
      console.error("TTS Error:", error);
      throw error;
    }
  }
}

module.exports = new GeminiService();
