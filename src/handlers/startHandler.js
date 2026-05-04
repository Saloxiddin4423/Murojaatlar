const { mainMenu, courtKeyboard } = require("../keyboards/keyboards");
const { resetForm } = require("../utils/helpers");
const { menuButtons } = require("../config/constants");

function registerStart(bot) {
  bot.start((ctx) => {
    resetForm(ctx);

    ctx.reply(
      "Toshkent shahar sudlariga murojaat botiga xush kelibsiz.",
      mainMenu()
    );
  });

  // 🔥 SHUNI QO‘SHASAN
  bot.hears(menuButtons.courtsInfo, (ctx) => {
    ctx.session.courtsInfo = {
      step: "courtType"
    };

    return ctx.reply(
      "Qaysi sud turi bo‘yicha ma’lumot kerak?",
      courtKeyboard()
    );
  });
}

module.exports = { registerStart };