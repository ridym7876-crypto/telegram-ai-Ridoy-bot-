require("dotenv").config();
const { Telegraf, session, Scenes, Markup } = require("telegraf");
const mongoose = require("mongoose");
const gemini = require("./src/services/gemini");

const bot = new Telegraf(process.env.BOT_TOKEN || '8804391497:AAHZ6lckG4GqWmQsQxj4DZgZdYnSFVuZEPo');

// MongoDB Connection (Optional but recommended)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
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
bot.action("gen_video", (ctx) => ctx.reply("ভিডিওর জন্য একটি বর্ণনা (Prompt) দিন:"));
bot.action("gen_image", (ctx) => ctx.reply("ছবির জন্য একটি বর্ণনা (Prompt) দিন:"));
bot.action("google_search", (ctx) => ctx.reply("আপনি কি খুঁজতে চান?"));
bot.action("gen_music", (ctx) => ctx.reply("কেমন মিউজিক চান? বর্ণনা দিন:"));
bot.action("gen_tts", (ctx) => ctx.reply("যে টেক্সটটি ভয়েস করতে চান তা লিখুন:"));

// Generic Message Handler
bot.on("text", async (ctx) => {
  const text = ctx.message.text;
  const loadingMsg = await ctx.reply("প্রসেস করা হচ্ছে, দয়া করে অপেক্ষা করুন...");

  try {
    // Simple logic to detect intent or use last action (for simplicity in this example)
    // In a real bot, scenes would be better
    if (text.toLowerCase().includes("search") || text.length > 50) {
       const response = await gemini.generateText(text, true);
       await ctx.reply(response);
    } else {
       const response = await gemini.generateText(text);
       await ctx.reply(response);
    }
  } catch (error) {
    console.error(error);
    await ctx.reply("দুঃখিত, কোনো সমস্যা হয়েছে।");
  } finally {
    await ctx.deleteMessage(loadingMsg.message_id).catch(() => {});
  }
});

// Handling Photo for Animation/Editing
bot.on("photo", async (ctx) => {
  await ctx.reply("ছবিটি পেয়েছি। আপনি কি এটি অ্যানিমেট করতে চান নাকি এডিট করতে চান?");
});

// Launch bot
bot.launch().then(() => console.log("Bot is running..."));

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
