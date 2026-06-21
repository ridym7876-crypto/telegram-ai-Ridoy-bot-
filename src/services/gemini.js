const { GoogleGenAI } = require("@google/genai");
const base44 = require("./base44");

class GeminiService {
  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async generateText(prompt, useSearch = false) {
    try {
      // Prioritize Base44 for text generation if configured, or use as fallback
      if (process.env.USE_BASE44 === 'true' || !process.env.GEMINI_API_KEY) {
        return await base44.callAI(prompt);
      }

      const config = useSearch ? { tools: [{ googleSearch: {} }] } : {};
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config,
      });
      return response.text;
    } catch (error) {
      console.error("Text Generation Error:", error);
      // Fallback to Base44 if Gemini fails
      try {
        return await base44.callAI(prompt);
      } catch (fallbackError) {
        throw error;
      }
    }
  }

  async generateImage(prompt) {
    try {
      const response = await this.ai.models.generateContent({
        model: "imagen-3-pro-preview",
        contents: prompt,
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return Buffer.from(part.inlineData.data, "base64");
        }
      }
      throw new Error("No image data found");
    } catch (error) {
      console.error("Image Generation Error:", error);
      throw error;
    }
  }

  async generateVideo(prompt) {
    try {
      const response = await this.ai.models.generateContent({
        model: "veo-3-1-preview",
        contents: prompt,
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return Buffer.from(part.inlineData.data, "base64");
        }
      }
      throw new Error("No video data found");
    } catch (error) {
      console.error("Video Generation Error:", error);
      throw error;
    }
  }

  async generateMusic(prompt, fullLength = false) {
    try {
      const model = fullLength ? "lyria-3-pro-preview" : "lyria-3-clip-preview";
      const response = await this.ai.models.generateContent({
        model: model,
        contents: prompt,
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return Buffer.from(part.inlineData.data, "base64");
        }
      }
      throw new Error("No music data found");
    } catch (error) {
      console.error("Music Generation Error:", error);
      throw error;
    }
  }

  async textToSpeech(text) {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-tts-preview",
        contents: text,
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return Buffer.from(part.inlineData.data, "base64");
        }
      }
      throw new Error("No speech data found");
    } catch (error) {
      console.error("TTS Error:", error);
      throw error;
    }
  }
}

module.exports = new GeminiService();
