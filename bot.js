require("dotenv").config();
const { Telegraf, session, Scenes, Markup } = require("telegraf");
const mongoose = require("mongoose");
const gemini = require("./src/services/gemini");

const TOKEN = '8804391497:AAHZ6lckG4GqWmQsQxj4DZgZdYnSFVuZEPo';
const bot = new Telegraf(TOKEN);

// MongoDB Connection (Optional but recommended)
if (process.env.MONGODB_URI && process.env.MONGODB_URI.startsWith('mongodb')) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
} else {
  console.log("MongoDB URI not set or invalid, skipping connection.");
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

// Generic Message Handler
bot.on("text", async (ctx) => {
  const text = ctx.message.text;
  const loadingMsg = await ctx.reply("প্রসেস করা হচ্ছে, দয়া করে অপেক্ষা করুন...");

  try {
    const response = await gemini.generateText(text);
    await ctx.reply(response);
  } catch (error) {
    console.error(error);
    await ctx.reply("দুঃখিত, কোনো সমস্যা হয়েছে।");
  } finally {
    await ctx.deleteMessage(loadingMsg.message_id).catch(() => {});
  }
});

// Launch bot
bot.launch()
  .then(() => console.log("Bot is running successfully!"))
  .catch((err) => console.error("Bot launch failed:", err));

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
