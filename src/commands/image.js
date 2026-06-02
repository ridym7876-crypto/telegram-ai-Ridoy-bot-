const { Scenes } = require("telegraf");
const imageGenerator = require("../services/imageGenerator");

const imageScene = new Scenes.BaseScene("image_gen");

imageScene.enter(async (ctx) => {
  await ctx.reply("আপনি কি ধরনের ছবি তৈরি করতে চান? বিস্তারিত বর্ণনা দিন।");
});

imageScene.on("text", async (ctx) => {
  const prompt = ctx.message.text;
  await ctx.reply("আপনার ছবি তৈরি হচ্ছে, একটু অপেক্ষা করুন...");
  try {
    const imageUrl = await imageGenerator.generateImage(prompt);
    await ctx.replyWithPhoto({ url: imageUrl });
    await ctx.reply("আপনার ছবি তৈরি হয়ে গেছে!");
  } catch (error) {
    console.error("Error generating image:", error);
    await ctx.reply("ছবি তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
  }
  ctx.scene.leave();
});

imageScene.leave(async (ctx) => {
  await ctx.reply("ছবি তৈরির সেশন শেষ হয়েছে।");
});

module.exports = imageScene;
