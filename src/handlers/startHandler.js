const { mainMenu } = require("../keyboards/keyboards");
const { resetForm } = require("../utils/helpers");

function registerStart(bot) {
  bot.start((ctx) => {
    resetForm(ctx);
    ctx.reply(
      "Toshkent shahar sudlariga murojaat botiga xush kelibsiz.",
      mainMenu()
    );
  });
}

module.exports = { registerStart };