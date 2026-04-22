const { courtKeyboard, districtKeyboard, mainMenu } = require("../keyboards/keyboards");
const { resetForm } = require("../utils/helpers");

function registerNavigation(bot) {
  bot.hears("📨 Murojaat yuborish", (ctx) => {
    resetForm(ctx);
    ctx.session.form.step = "courtType";
    ctx.reply("Sud turini tanlang:", courtKeyboard());
  });

  bot.hears("⬅️ Orqaga", (ctx) => {
    resetForm(ctx);
    ctx.reply("Bosh menyu", mainMenu());
  });
}

module.exports = { registerNavigation };