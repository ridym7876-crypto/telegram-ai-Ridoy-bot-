const { GoogleGenerativeAI } = require("@google/generative-ai");
const base44 = require("./base44");

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
        // Use Base44 as a textual/image-generation helper. The exact response depends on the API.
        const res = await base44.callAI(`Generate an image or an image prompt for: ${prompt}`);
        return typeof res === 'string' ? res : 'Image generation অনুরোধ পাঠানো হয়েছে।';
      }

      // If no Base44 available, return a friendly message instead of throwing.
      return 'Image generation বর্তমানে অনুপলব্ধ — অনুগ্রহ করে later বা Base44 সক্রিয় করুন।';
    } catch (error) {
      console.error("Image Generation Error:", error?.message || error);
      return 'দুঃখিত, ইমেজ তৈরি করা যায়নি। পরে আবার চেষ্টা করুন।';
    }
  }

  async generateVideo(prompt) {
    // Placeholder implementation — keep non-throwing so bot remains responsive
    console.warn('generateVideo called but not implemented.');
    return 'Video generation এখনও ডেভেলপমেন্টে আছে। শীঘ্রই আপডেট করা হবে।';
  }

  async generateMusic(prompt) {
    console.warn('generateMusic called but not implemented.');
    return 'Music generation এখনও ডেভেলপমেন্টে আছে।';
  }

  async textToSpeech(text) {
    console.warn('textToSpeech called but not implemented.');
    return 'TTS ফিচারটি এখনও ডেভেলপমেন্টে আছে।';
  }
}

module.exports = new GeminiService();
