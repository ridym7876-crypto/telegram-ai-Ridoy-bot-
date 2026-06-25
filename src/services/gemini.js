const { GoogleGenerativeAI } = require("@google/generative-ai");
const base44 = require("./base44");
const videoGen = require("./videoGenerator");
const audioGen = require("./audioGenerator");

class GeminiService {
  constructor() {
    this.hasGeminiKey = !!process.env.GEMINI_API_KEY;
    this.useBase44 = (process.env.USE_BASE44 || 'false').toLowerCase() === 'true';

    if (this.hasGeminiKey) {
      // Initialize client if API key is present.
      // NOTE: Depending on the @google/generative-ai package version, the constructor/usage may differ.
      // This keeps the existing pattern but only initializes when a key is provided.
      try {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      } catch (err) {
        console.warn('Warning: Could not initialize GoogleGenerativeAI client:', err?.message || err);
        this.genAI = null;
      }
    } else {
      this.genAI = null;
    }
  }

  async generateText(prompt, useSearch = false) {
    // Priority: If USE_BASE44=true -> use base44. Else if Gemini key present -> use Gemini. Else give instruction message.
    try {
      if (this.useBase44) {
        const res = await base44.callAI(prompt);
        return typeof res === 'string' ? res : (res || 'কোথাও কিছু উত্তর পাওয়া যায়নি।');
      }

      if (!this.genAI) {
        return 'GPT / Gemini API কী সেট করা হয়নি। আপনার .env ফাইলে GEMINI_API_KEY যোগ করুন অথবা USE_BASE44=true সেট করে Base44 ব্যবহার করুন।';
      }

      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      return text || 'কোথাও কিছু উত্তর পাওয়া যায়নি।';
    } catch (error) {
      console.error("Text Generation Error:", error?.message || error);
      // Try fallback to Base44 if available
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
      if (this.useBase44) {
        const res = await base44.callAI(`Generate an image or an image prompt for: ${prompt}`);
        return typeof res === 'string' ? res : 'Image generation অনুরোধ পাঠানো হয়েছে।';
      }

      if (!this.genAI) {
        return 'Image generation সক্ষম করতে GEMINI_API_KEY নির্ধারণ করুন অথবা USE_BASE44=true সেট করুন।';
      }

      // Placeholder: implement Gemini image generation when integrated.
      return 'Image generation বর্তমানে অনুপলব্ধ — অনুগ্রহ করে later বা Base44 সক্রিয় করুন।';
    } catch (error) {
      console.error("Image Generation Error:", error?.message || error);
      return 'দুঃখিত, ইমেজ তৈরি করা যায়নি। পরে আবার চেষ্টা করুন।';
    }
  }

  async generateVideo(prompt) {
    try {
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
      const url = await audioGen.generateAudio(text, 'tts');
      return url || 'TTS অনুরোধ গৃহীত হয়েছে (placeholder)।';
    } catch (error) {
      console.error("TTS Error:", error?.message || error);
      return 'TTS ফিচারটি বর্তমানে অনুপলব্ধ — পরে আবার চেষ্টা করুন।';
    }
  }
}

module.exports = new GeminiService();
