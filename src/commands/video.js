const { Scenes } = require("telegraf");
const videoGenerator = require("../services/videoGenerator");

const videoScene = new Scenes.BaseScene("video_gen");

videoScene.enter(async (ctx) => {
  await ctx.reply("আপনি কি ধরনের ভিডিও তৈরি করতে চান? বিস্তারিত বর্ণনা দিন।");
});

videoScene.on("text", async (ctx) => {
  const prompt = ctx.message.text;
  await ctx.reply("আপনার ভিডিও তৈরি হচ্ছে, একটু অপেক্ষা করুন...");
  try {
    const videoUrl = await videoGenerator.generateVideo(prompt);
    await ctx.replyWithVideo({ url: videoUrl });
    await ctx.reply("আপনার ভিডিও তৈরি হয়ে গেছে!");
  } catch (error) {
    console.error("Error generating video:", error);
    await ctx.reply("ভিডিও তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
  }
  ctx.scene.leave();
});

videoScene.leave(async (ctx) => {
  await ctx.reply("ভিডিও তৈরির সেশন শেষ হয়েছে।");
});

module.exports = videoScene;
