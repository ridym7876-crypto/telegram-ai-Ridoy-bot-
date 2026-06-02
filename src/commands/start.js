const { Markup } = require("telegraf");

module.exports = async (ctx) => {
  await ctx.reply(
    "নমস্কার! আমি আপনার AI সহকারী। আপনি আমাকে টেক্সট টু ভিডিও, ইমেজ, অ্যানিমেশন, গান/গজল তৈরি এবং এডিট করতে বলতে পারেন। কিভাবে আমি আপনাকে সাহায্য করতে পারি?",
    Markup.inlineKeyboard([
      [Markup.button.callback("টেক্সট টু ইমেজ", "image_gen")],
      [Markup.button.callback("টেক্সট টু ভিডিও", "video_gen")],
      [Markup.button.callback("টেক্সট টু গান/গজল", "audio_gen")],
      [Markup.button.callback("ইমেজ এডিটিং", "image_edit")],
      [Markup.button.callback("ভিডিও এডিটিং", "video_edit")],
      [Markup.button.callback("গান/গজল এডিটিং", "audio_edit")],
    ])
  );
};
