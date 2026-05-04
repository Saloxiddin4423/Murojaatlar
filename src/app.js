const express = require("express");
const path = require("path");
const bot = require("./bot/bot");

const { handleAI } = require("./handlers/aiHandler");
const { registerStart } = require("./handlers/startHandler");
const { registerNavigation } = require("./handlers/navigationHandler");
const { registerForm } = require("./handlers/formHandler");
const { registerApplication } = require("./handlers/applicationHandler");
const { registerInfo } = require("./handlers/infoHandler"); // 🔥 YANGI

const { saveSignature } = require("./services/signatureStore");
const { adminHandler } = require("./handlers/adminHandler");

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/webapp", express.static(path.join(__dirname, "../webapp")));

adminHandler(bot);

// 🔥 BOT HANDLERLAR
registerStart(bot);
registerNavigation(bot);
registerInfo(bot); // 🔥 SHU MUHIM
registerApplication(bot);
registerForm(bot);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Bot ishlayapti");
});

// SIGNATURE API
app.post("/api/signature", (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Rasm topilmadi" });
    }

    const signatureId = saveSignature(image);

    return res.json({ success: true, signatureId });
  } catch (error) {
    console.error("SIGNATURE SAVE ERROR:", error);
    return res.status(500).json({ error: "Saqlashda xatolik" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server ${PORT} portda`);
});

bot.launch().then(() => {
  console.log("Telegram bot ishga tushdi");
});

bot.on("text", handleAI);