require("dotenv").config();
const { Telegraf, session } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(
  session({
    defaultSession: () => ({
      form: {
        step: null,
        courtType: "",
        district: "",
        fullName: "",
        phone: "",
        address: "",
        message: ""
      }
    })
  })
);

module.exports = bot;