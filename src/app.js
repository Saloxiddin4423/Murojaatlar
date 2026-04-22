const express = require("express");
const path = require("path");
const bot = require("./bot/bot");

const { registerStart } = require("./handlers/startHandler");
const { registerNavigation } = require("./handlers/navigationHandler");
const { registerForm } = require("./handlers/formHandler");
const { registerApplication } = require("./handlers/applicationHandler");

const app = express();

app.use("/webapp", express.static(path.join(__dirname, "../webapp")));

registerStart(bot);
registerNavigation(bot);
registerApplication(bot);
registerForm(bot);

app.get("/", (req, res) => {
  res.send("Bot ishlayapti");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server ${PORT} portda`);
});

bot.launch().then(() => {
  console.log("Telegram bot ishga tushdi");
});