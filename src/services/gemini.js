const { GoogleGenerativeAI } = require("@google/generative-ai");
const base44 = require("./base44");
const videoGen = require("./videoGenerator");
const audioGen = require("./audioGenerator");

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  }

  async generateText(prompt, useSearch = false) {
    try {
      if (process.env.USE_BASE44 === 'true' || !process.env.GEMINI_API_KEY) {
        const res = await base44.callAI(prompt);
        return typeof res === 'string' ? res : (res || 'কোথাও কিছু উত্তর পাওয়া যায়নি।');
      }

      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      return text || 'কোথাও কিছু উত্তর পাওয়া যায়নি।';
    } catch (error) {
      console.error("Text Generation Error:", error?.message || error);
      try {
        const fallback = await base44.callAI(prompt);
        return typeof fallback === 'string' ? fallback : (fallback || 'কোথাও কিছু উত্তর পাওয়া যায়নি।');
      } catch (fallbackError) {
        console.error('Fallback (Base44) failed:', fallbackError?.message || fallbackError);
        return 'দুঃখিত, এখনই উত্তর তৈরি করা সম্ভব হচ্ছে না। পরে চেষ্টা করুন।';
      }
    }
  }

  async generateImage(prompt) {
    try {
      if (process.env.USE_BASE44 === 'true') {
        const res = await base44.callAI(`Generate an image or an image prompt for: ${prompt}`);
        return typeof res === 'string' ? res : 'Image generation অনুরোধ পাঠানো হয়েছে।';
      }
      return 'Image generation বর্তমানে অনুপলব্ধ — অনুগ্রহ করে later বা Base44 সক্রিয় করুন।';
    } catch (error) {
      console.error("Image Generation Error:", error?.message || error);
      return 'দুঃখিত, ইমেজ তৈরি করা যায়নি। পরে আবার চেষ্টা করুন।';
    }
  }

  async generateVideo(prompt) {
    try {
      // Prefer a dedicated video generator module (placeholder implementation provided)
      const url = await videoGen.generateVideo(prompt);
      return url || 'Video generation অনুরোধ গৃহীত হয়েছে (placeholder)।';
    } catch (error) {
      console.error("Video Generation Error:", error?.message || error);
      return 'Video generation বর্তমানে অনুপলব্ধ — পরে আবার চেষ্টা করুন।';
    }
  }

  async generateMusic(prompt) {
    try {
      const url = await audioGen.generateAudio(prompt, 'song');
      return url || 'Music generation অনুরোধ গৃহীত হয়েছে (placeholder)।';
    } catch (error) {
      console.error("Music Generation Error:", error?.message || error);
      return 'Music generation বর্তমানে অনুপলব্ধ — পরে আবার চেষ্টা করুন।';
    }
  }

  async textToSpeech(text) {
    try {
      // Use audio generator for TTS (placeholder mp3 returned)
      const url = await audioGen.generateAudio(text, 'tts');
      return url || 'TTS অনুরোধ গৃহীত হয়েছে (placeholder)।';
    } catch (error) {
      console.error("TTS Error:", error?.message || error);
      return 'TTS ফিচারটি বর্তমানে অনুপলব্ধ — পরে আবার চেষ্টা করুন।';
    }
  }
}

module.exports = new GeminiService();
