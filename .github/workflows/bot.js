require("dotenv").config();

const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(
    "🤖 Ultimate AI Bot",
    Markup.keyboard([
      ["💬 Chat AI"],
      ["🎨 Generate Image"],
      ["🎬 Generate Video"],
      ["🎤 Generate Audio"],
      ["🎵 Generate Song"],
      ["🕌 Generate Gojol"]
    ]).resize()
  );
});

bot.hears("💬 Chat AI", (ctx) => {
  ctx.reply("আপনার প্রশ্ন লিখুন");
});

bot.launch();

console.log("Bot Running...");
