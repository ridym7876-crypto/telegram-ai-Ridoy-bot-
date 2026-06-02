
require("dotenv").config();
const { Telegraf, session, Scenes } = require("telegraf");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const mongoose = require("mongoose");

const bot = new Telegraf(process.env.BOT_TOKEN);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Import scenes
const imageScene = require("./src/commands/image");
const videoScene = require("./src/commands/video");
const songScene = require("./src/commands/song");

// Create a stage for the scenes
const stage = new Scenes.Stage([imageScene, videoScene, songScene]);

// Middleware
bot.use(session());
bot.use(stage.middleware());

// Import commands
const startCommand = require("./src/commands/start");

// Register commands
bot.start(startCommand);

bot.action("image_gen", (ctx) => ctx.scene.enter("image_gen"));
bot.action("video_gen", (ctx) => ctx.scene.enter("video_gen"));
bot.action("audio_gen", (ctx) => ctx.scene.enter("audio_gen"));

bot.action("image_edit", async (ctx) => {
  await ctx.reply("ছবি এডিট করার জন্য, প্রথমে ছবিটি আপলোড করুন এবং তারপর আপনার এডিটিং এর বর্ণনা দিন।");
});
bot.action("video_edit", async (ctx) => {
  await ctx.reply("ভিডিও এডিট করার জন্য, প্রথমে ভিডিওটি আপলোড করুন এবং তারপর আপনার এডিটিং এর বর্ণনা দিন।");
});
bot.action("audio_edit", async (ctx) => {
  await ctx.reply("গান/গজল এডিট করার জন্য, প্রথমে অডিওটি আপলোড করুন এবং তারপর আপনার এডিটিং এর বর্ণনা দিন।");
});

// Generic text handler for Gemini Pro (if not in a scene)
bot.on("text", async (ctx) => {
  if (!ctx.scene.current) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = ctx.message.text;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      await ctx.reply(text);
    } catch (error) {
      console.error("Error with Gemini API:", error);
      await ctx.reply("দুঃখিত, আপনার অনুরোধ প্রক্রিয়া করতে পারিনি।");
    }
  }
});

// Launch bot
bot.launch();

console.log("Bot started");

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
