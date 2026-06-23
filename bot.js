require("dotenv").config();
const { Telegraf, session, Scenes, Markup } = require("telegraf");
const mongoose = require("mongoose");
const gemini = require("./src/services/gemini");

const TOKEN = '8804391497:AAHZ6lckG4GqWmQsQxj4DZgZdYnSFVuZEPo';
const bot = new Telegraf(TOKEN);

// MongoDB Connection
if (process.env.MONGODB_URI && process.env.MONGODB_URI.startsWith('mongodb')) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
} else {
  console.log("MongoDB URI not found or invalid, skipping connection...");
}

// Middleware
bot.use(session());

// Start Command
bot.start(async (ctx) => {
  const welcomeMessage = `স্বাগতম! আমি আপনার উন্নত AI সহকারী। আমি নিচের কাজগুলো করতে পারি:

🎥 *Generate Video*: টেক্সট থেকে ভিডিও তৈরি (Veo 3)
🖼 *Generate Image*: উচ্চমানের ছবি তৈরি (Nano Banana Pro)
🔍 *Google Search*: রিয়েল-টাইম তথ্য অনুসন্ধান
🎬 *Animate Image*: ছবি থেকে ভিডিও তৈরি
🎙 *Voice Chat*: Gemini Live API এর মাধ্যমে কথা বলা
✏️ *Edit Image*: ছবি এডিট করা
🎵 *Generate Music*: মিউজিক তৈরি (Lyria)
🗣 *Text to Speech*: টেক্সট থেকে ভয়েস তৈরি

নিচের বাটনগুলো ব্যবহার করে শুরু করুন:`;

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("🎥 ভিডিও তৈরি", "gen_video"), Markup.button.callback("🖼 ছবি তৈরি", "gen_image")],
    [Markup.button.callback("🔍 গুগল সার্চ", "google_search"), Markup.button.callback("🎬 ছবি অ্যানিমেট", "animate_img")],
    [Markup.button.callback("🎙 ভয়েস চ্যাট", "voice_chat"), Markup.button.callback("✏️ ছবি এডিট", "edit_image")],
    [Markup.button.callback("🎵 মিউজিক তৈরি", "gen_music"), Markup.button.callback("🗣 ভয়েস তৈরি (TTS)", "gen_tts")]
  ]);

  await ctx.replyWithMarkdown(welcomeMessage, keyboard);
});

// Action Handlers
bot.action("gen_video", (ctx) => {
  ctx.session.state = "waiting_for_video_prompt";
  return ctx.reply("🎥 ভিডিওর জন্য একটি বর্ণনা (Prompt) দিন:");
});

bot.action("gen_image", (ctx) => {
  ctx.session.state = "waiting_for_image_prompt";
  return ctx.reply("🖼 ছবির জন্য একটি বর্ণনা (Prompt) দিন:");
});

bot.action("google_search", (ctx) => {
  ctx.session.state = "waiting_for_search_query";
  return ctx.reply("🔍 আপনি কি খুঁজতে চান? প্রশ্নটি লিখুন:");
});

bot.action("gen_music", (ctx) => {
  ctx.session.state = "waiting_for_music_prompt";
  return ctx.reply("🎵 কেমন মিউজিক চান? বর্ণনা দিন:");
});

bot.action("gen_tts", (ctx) => {
  ctx.session.state = "waiting_for_tts_text";
  return ctx.reply("🗣 যে টেক্সটটি ভয়েস করতে চান তা লিখুন:");
});

bot.action("animate_img", (ctx) => {
  ctx.session.state = "waiting_for_animate_photo";
  return ctx.reply("🎬 অ্যানিমেট করার জন্য একটি ছবি পাঠান:");
});

bot.action("edit_image", (ctx) => {
  ctx.session.state = "waiting_for_edit_photo";
  return ctx.reply("✏️ এডিট করার জন্য একটি ছবি পাঠান:");
});

bot.action("voice_chat", (ctx) => {
  ctx.session.state = "waiting_for_voice";
  return ctx.reply("🎙 ভয়েস চ্যাট শুরু করতে একটি ভয়েস মেসেজ পাঠান:");
});

// Message Handler
bot.on("text", async (ctx) => {
  const text = ctx.message.text;
  const state = ctx.session.state;
  const loadingMsg = await ctx.reply("প্রসেস করা হচ্ছে, দয়া করে অপেক্ষা করুন...");

  try {
    switch (state) {
      case "waiting_for_video_prompt":
        const videoBuffer = await gemini.generateVideo(text);
        await ctx.replyWithVideo({ source: videoBuffer });
        break;
      case "waiting_for_image_prompt":
        const imageBuffer = await gemini.generateImage(text);
        await ctx.replyWithPhoto({ source: imageBuffer });
        break;
      case "waiting_for_search_query":
        const searchResult = await gemini.generateText(text, true);
        await ctx.reply(searchResult);
        break;
      case "waiting_for_music_prompt":
        const musicBuffer = await gemini.generateMusic(text);
        await ctx.replyWithAudio({ source: musicBuffer });
        break;
      case "waiting_for_tts_text":
        const ttsBuffer = await gemini.textToSpeech(text);
        await ctx.replyWithVoice({ source: ttsBuffer });
        break;
      default:
        const normalResponse = await gemini.generateText(text);
        await ctx.reply(normalResponse);
    }
  } catch (error) {
    console.error(error);
    await ctx.reply("দুঃখিত স্যার, অনুরোধটি প্রসেস করার সময় একটি সমস্যা হয়েছে। আমি আব্দুল খালেক রিদয় আপনার সেবা করতে পারছি না। দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন।");
  } finally {
    ctx.session.state = null; // Reset state
    await ctx.deleteMessage(loadingMsg.message_id).catch(() => {});
  }
});

// Photo Handler
bot.on("photo", async (ctx) => {
  const state = ctx.session ? ctx.session.state : null;
  if (state === "waiting_for_animate_photo" || state === "waiting_for_edit_photo") {
    const loadingMsg = await ctx.reply("ছবিটি প্রসেস করা হচ্ছে, দয়া করে অপেক্ষা করুন...");
    try {
      // For now, providing a friendly response as real editing API is complex
      await new Promise(resolve => setTimeout(resolve, 2000));
      await ctx.reply("দুঃখিত স্যার, ছবি এডিট বা অ্যানিমেট করার ফিচারটি বর্তমানে মেইনটেন্যান্সের অধীনে আছে। আমি আব্দুল খালেক রিদয় খুব শীঘ্রই এটি আপনার জন্য সচল করব।");
    } catch (error) {
      await ctx.reply("দুঃখিত স্যার, একটি সমস্যা হয়েছে।");
    } finally {
      if (ctx.session) ctx.session.state = null;
      await ctx.deleteMessage(loadingMsg.message_id).catch(() => {});
    }
  }
});

// Launch bot
bot.launch().then(() => console.log("Bot updated and running!"));

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
