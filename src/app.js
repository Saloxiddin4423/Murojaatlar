const express = require("express");
const bot = require("./bot/bot");

const { registerStart } = require("./handlers/startHandler");
const { registerNavigation } = require("./handlers/navigationHandler");
const { registerForm } = require("./handlers/formHandler");

const app = express();

registerStart(bot);
registerNavigation(bot);
registerForm(bot);

app.get("/", (req, res) => {
  res.send("Bot ishlayapti");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server ${PORT} portda`);
});

bot.launch();