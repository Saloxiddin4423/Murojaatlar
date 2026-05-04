const { courtTypes, courtsByType, menuButtons } = require("../config/constants");
const { districtKeyboard, mainMenu } = require("../keyboards/keyboards");
const { courtsInfo } = require("../config/courtsInfo");

const allCourts = Object.values(courtsByType).flat();

function registerInfo(bot) {
  bot.hears(courtTypes, async (ctx, next) => {
    const state = ctx.session.courtsInfo;

    if (!state || state.step !== "courtType") return next();

    const courtType = ctx.message.text;

    ctx.session.courtsInfo = {
      step: "court",
      courtType
    };

    return ctx.reply("Sudni tanlang:", districtKeyboard(courtType));
  });

  bot.hears(allCourts, async (ctx, next) => {
    const state = ctx.session.courtsInfo;

    if (!state || state.step !== "court") return next();

    const courtType = state.courtType;
    const selectedCourt = ctx.message.text;

    const info = courtsInfo[courtType]?.[selectedCourt];

    ctx.session.courtsInfo = null;

    if (!info) {
      return ctx.reply(
        "Bu sud bo‘yicha ma’lumot hali kiritilmagan.",
        mainMenu()
      );
    }

    return ctx.reply(
  `
🏛 <b>${info.name}</b>

📍 <b>Manzil:</b> ${info.address}
📞 <b>Telefon:</b> ${info.phone}
📧 <b>Elektron pochta:</b> ${info.email}
`,
  {
    parse_mode: "HTML",
   reply_markup: {
  inline_keyboard: [
    [
      {
        text: "📍 Xaritada ochish",
        url:
          info.mapUrl ||
          "https://maps.google.com/?q=" + encodeURIComponent(info.address)
      }
    ]
  ]
}
  }
);
  });

  bot.hears(menuButtons.back, async (ctx, next) => {
    if (!ctx.session.courtsInfo) return next();

    ctx.session.courtsInfo = null;
    return ctx.reply("Asosiy menyu:", mainMenu());
  });
}

module.exports = { registerInfo };