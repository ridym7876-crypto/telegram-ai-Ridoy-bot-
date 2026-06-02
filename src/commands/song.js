const { Scenes } = require("telegraf");
const audioGenerator = require("../services/audioGenerator");

const songScene = new Scenes.BaseScene("audio_gen");

songScene.enter(async (ctx) => {
  await ctx.reply("আপনি কি ধরনের গান তৈরি করতে চান? বিস্তারিত বর্ণনা দিন।");
});

songScene.on("text", async (ctx) => {
  const prompt = ctx.message.text;
  await ctx.reply("আপনার গান তৈরি হচ্ছে, একটু অপেক্ষা করুন...");
  try {
    const audioUrl = await audioGenerator.generateAudio(prompt, "song");
    await ctx.replyWithAudio({ url: audioUrl });
    await ctx.reply("আপনার গান তৈরি হয়ে গেছে!");
  } catch (error) {
    console.error("Error generating song:", error);
    await ctx.reply("গান তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
  }
  ctx.scene.leave();
});

songScene.leave(async (ctx) => {
  await ctx.reply("গান তৈরির সেশন শেষ হয়েছে।");
});

module.exports = songScene;
