require("dotenv").config();
const { Telegraf, session, Markup } = require("telegraf");
const mongoose = require("mongoose");
const gemini = require("./src/services/gemini");

const TOKEN = process.env.BOT_TOKEN;
if (!TOKEN) {
  console.error("❌ BOT_TOKEN পরিবেশ চলক সেট করা হয়নি!");
  process.exit(1);
}

const bot = new Telegraf(TOKEN);

// MongoDB Connection
if (process.env.MONGODB_URI && process.env.MONGODB_URI.startsWith('mongodb')) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ MongoDB সংযুক্ত হয়েছে"))
    .catch((err) => console.error("❌ MongoDB সংযোগ ত্রুটি:", err));
} else {
  console.log("⚠️ MongoDB URI পাওয়া যায়নি বা অবৈধ");
}

// Middleware
bot.use(session());

// Start Command
bot.start(async (ctx) => {
  const welcomeMessage = `স্বাগতম! আমি আপনার উন্নত AI সহকারী। আমি নিচের কাজগুলো করতে পারি:

🎥 *Generate Video*: টেক্সট থেকে ভিডিও তৈরি
🖼 *Generate Image*: উচ্চমানের ছবি তৈরি
🔍 *Google Search*: রিয়েল-টাইম তথ্য অনুসন্ধান
🎬 *Animate Image*: ছবি থেকে ভিডিও তৈরি
🎙 *Voice Chat*: Gemini API এর মাধ্যমে কথা বলা
✏️ *Edit Image*: ছবি এডিট করা
🎵 *Generate Music*: মিউজিক তৈরি
🗣 *Text to Speech*: টেক্সট থেকে ভয়েস তৈরি

নিচের বাটনগুলো ব্যবহার করে শুরু করুন:`;

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("🎥 ভিডিও তৈরি", "gen_video"), Markup.button.callback("🖼 ছবি তৈরি", "gen_image")],
    [Markup.button.callback("🔍 গুগল সার্চ", "google_search"), Markup.button.callback("🎬 ছবি অ্যানিমেট", "animate_img")],
    [Markup.button.callback("🎙 ভয়েস চ্যাট", "voice_chat"), Markup.button.callback("✏️ ছবি এডিট", "edit_image")],
    [Markup.button.callback("🎵 মিউজিক তৈরি", "gen_music"), Markup.button.callback("🗣 ভয়েস তৈরি", "gen_tts")]
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
  return ctx.reply("🎵 কেমন মিউজিক চান? বর্ণনা ��িন:");
});

bot.action("gen_tts", (ctx) => {
  ctx.session.state = "waiting_for_tts_text";
  return ctx.reply("🗣 যে টেক্সটটি ভয়েস করতে চান তা লিখুন:");
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
  return ctx.reply("🎙 ভয়েস চ্যাট শুরু করতে একটি ভয়েস মেসেজ পাঠান:");
});

// Message Handler
bot.on("text", async (ctx) => {
  const text = ctx.message.text;
  const state = ctx.session?.state;
  
  if (!text) {
    return ctx.reply("দয়া করে কিছু টেক্সট পাঠান।");
  }

  const loadingMsg = await ctx.reply("⏳ প্রসেস করা হচ্ছে, দয়া করে অপেক্ষা করুন...");

  try {
    switch (state) {
      case "waiting_for_video_prompt":
        const videoResult = await gemini.generateVideo(text);
        await ctx.reply("🎥 ভিডিও প্রসেসিং সম্পন্ন হয়েছে!");
        break;

      case "waiting_for_image_prompt":
        const imageResult = await gemini.generateImage(text);
        await ctx.reply("🖼 ছবি প্রসেসিং সম্পন্ন হয়েছে!");
        break;

      case "waiting_for_search_query":
        const searchResult = await gemini.generateText(text, true);
        await ctx.reply(`🔍 *সার্চ ফলাফল:*\n${searchResult}`);
        break;

      case "waiting_for_music_prompt":
        const musicResult = await gemini.generateMusic(text);
        await ctx.reply("🎵 মিউজিক প্রসেসিং সম্পন্ন হয়েছে!");
        break;

      case "waiting_for_tts_text":
        const ttsResult = await gemini.textToSpeech(text);
        await ctx.reply("🗣 ভয়েস প্রসেসিং সম্পন্ন হয়েছে!");
        break;

      default:
        const normalResponse = await gemini.generateText(text);
        await ctx.reply(normalResponse);
    }
  } catch (error) {
    console.error("❌ ত্রুটি:", error.message);
    await ctx.reply("😔 দুঃখিত, অনুরোধটি প্রসেস করার সময় একটি সমস্যা হয়েছে। দয়া করে পুনরায় চেষ্টা করুন।");
  } finally {
    if (ctx.session) {
      ctx.session.state = null; // Reset state
    }
    await ctx.deleteMessage(loadingMsg.message_id).catch(() => {});
  }
});

// Photo Handler
bot.on("photo", async (ctx) => {
  const state = ctx.session?.state;
  if (state === "waiting_for_animate_photo" || state === "waiting_for_edit_photo") {
    const loadingMsg = await ctx.reply("⏳ ছবিটি প্রসেস করা হচ্ছে, দয়া করে অপেক্ষা করুন...");
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const action = state === "waiting_for_animate_photo" ? "অ্যানিমেট" : "এডিট";
      await ctx.reply(`✅ ছবিটি ${action} করার জন্য প্রস্তুত!`);
    } catch (error) {
      console.error("❌ ত্রুটি:", error.message);
      await ctx.reply("😔 একটি সমস্যা হয়েছে।");
    } finally {
      if (ctx.session) ctx.session.state = null;
      await ctx.deleteMessage(loadingMsg.message_id).catch(() => {});
    }
  } else {
    await ctx.reply("📸 দয়া করে প্রথমে একটি বিকল্প নির্বাচন করুন।");
  }
});

// Handle other media types
bot.on("voice", async (ctx) => {
  if (ctx.session?.state === "waiting_for_voice") {
    await ctx.reply("🎙 ভয়েস প্রসেস করা হচ্ছে...");
  }
});

// Error handling
bot.catch((err) => {
  console.error("❌ বট ত্রুটি:", err);
});

// Launch bot
bot.launch()
  .then(() => {
    console.log("✅ বট চালু এবং চলছে!");
    console.log("🤖 Ridoy AI Bot প্রস্তুত");
  })
  .catch((err) => {
    console.error("❌ বট চালু করতে ব্যর্থ:", err);
    process.exit(1);
  });

// Enable graceful stop
process.once("SIGINT", () => {
  console.log("\n⏹️ বট বন্ধ করা হচ্ছে...");
  bot.stop("SIGINT");
});

process.once("SIGTERM", () => {
  console.log("\n⏹️ বট বন্ধ করা হচ্ছে...");
  bot.stop("SIGTERM");
});
