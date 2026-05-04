const {
  applicationCourtTypes,
  applicationTypes,
  courtsByType,
  menuButtons,
} = require("../config/constants");

const {
  districtKeyboard,
  applicationTypesKeyboard,
  finishPhotosKeyboard,
  signatureKeyboard,
  mainMenu,
} = require("../keyboards/keyboards");

const { getApplicationByTitle } = require("../applications/registry");
const { resetApplicationForm } = require("../utils/helpers");
const { generateApplicationPdf } = require("../services/applicationPdfService");
const { getSignature, removeSignature } = require("../services/signatureStore");
const { generateApplication } = require("../services/aiService");

const allCourts = Object.values(courtsByType).flat();
function registerApplication(bot) {
  bot.hears(applicationCourtTypes, async (ctx, next) => {
    const form = ctx.session.applicationForm;
    if (!form || form.step !== "courtType") return next();

    const courtType = ctx.message.text;

    form.courtType = courtType;
    form.step = "district";

    return ctx.reply("Sudni tanlang:", districtKeyboard(courtType));
  });

  bot.hears(allCourts, async (ctx, next) => {
    const form = ctx.session.applicationForm;
    if (!form || form.step !== "district") return next();

    form.district = ctx.message.text;
    form.step = "applicationType";

    return ctx.reply("Ariza turini tanlang:", applicationTypesKeyboard());
  });

  bot.hears(applicationTypes, async (ctx, next) => {
    const form = ctx.session.applicationForm;
    if (!form || form.step !== "applicationType") return next();

    const text = ctx.message.text;
    const selectedApplication = getApplicationByTitle(text);

    if (!selectedApplication) {
      return ctx.reply("Bunday ariza turi topilmadi.");
    }

    form.applicationType = selectedApplication.title;
    form.applicationId = selectedApplication.id;

    if (selectedApplication.id === "aiApplication") {
      form.step = "aiText";

      return ctx.reply(
        "Ariza mazmunini oddiy qilib yozing.\n\nMasalan:\nQo‘shnim meni haqorat qildi, shunga ariza yozmoqchiman."
      );
    }

    if (selectedApplication.id === "documentCopyRequest") {
      form.step = "copyApplicantFullName";
      return ctx.reply("Ariza beruvchining F.I.Sh ni kiriting:");
    }

    if (selectedApplication.id === "meetingPermission") {
      form.step = "applicantFullName";
      return ctx.reply("Ariza beruvchining F.I.Sh ni kiriting:");
    }

    return ctx.reply("Bu ariza turi hali sozlanmagan.");
  });

  bot.on("photo", async (ctx, next) => {
    const form = ctx.session.applicationForm;

    if (!form || form.step !== "passportPhotos") return next();

    try {
      const photos = ctx.message.photo;

      if (!photos || !photos.length) {
        return ctx.reply("Rasmni qayta yuboring.");
      }

      const largestPhoto = photos[photos.length - 1];

      if (!Array.isArray(form.passportPhotos)) {
        form.passportPhotos = [];
      }

      form.passportPhotos.push(largestPhoto.file_id);

      return ctx.reply(
        `Rasm qabul qilindi. Jami: ${form.passportPhotos.length} ta\nYana rasm yuboring yoki tugmani bosing.`,
        finishPhotosKeyboard()
      );
    } catch (error) {
      console.error("Photo qabul qilishda xato:", error);
      return ctx.reply("Rasmni qabul qilishda xatolik yuz berdi.");
    }
  });

  bot.on("message", async (ctx, next) => {
    const form = ctx.session.applicationForm;

    if (!ctx.message.web_app_data) return next();
    if (!form || form.step !== "signature") return next();

    try {
      const rawData = ctx.message.web_app_data.data;
      const data = JSON.parse(rawData);

      if (data.type === "signature" && data.signatureId) {
        const savedImage = getSignature(data.signatureId);

        if (!savedImage) {
          return ctx.reply("Imzo topilmadi yoki muddati o‘tgan.");
        }

        form.signature = savedImage;
        removeSignature(data.signatureId);

        return ctx.reply(
          "Imzo saqlandi. Endi PDF tayyorlash tugmasini bosing.",
          signatureKeyboard()
        );
      }

      return ctx.reply("Imzo ma'lumoti noto‘g‘ri keldi.");
    } catch (error) {
      console.error("WebApp data parse xato:", error);
      return ctx.reply("Imzoni qabul qilishda xatolik yuz berdi.");
    }
  });

  bot.on("text", async (ctx, next) => {
    const form = ctx.session.applicationForm;
    const text = ctx.message.text;

    const hasCyrillic = /[А-Яа-яЁёҚқҒғҲҳЎў]/.test(text);

    const allowedButtons = [
      "/start",
      menuButtons.appeal,
      menuButtons.application,
      menuButtons.courtsInfo,
      menuButtons.back,
      menuButtons.finishPhotos,
      menuButtons.finishApplication,
      menuButtons.openSignature,
      ...applicationCourtTypes,
      ...applicationTypes,
      ...allCourts,
    ];

    if (hasCyrillic && !allowedButtons.includes(text)) {
      return ctx.reply(
        "Iltimos, ma’lumotlarni lotin harflarida kiriting.\n\nMasalan: Saloxiddin Turgunov"
      );
    }

    if (!form || !form.step) return next();

    if (form.step === "aiText") {
      try {
        await ctx.reply("⏳ AI arizangizni tayyorlayapti...");

        const result = await generateApplication(text);

        form.aiGeneratedText = result;
        form.step = null;

        await ctx.reply(result, mainMenu());
        resetApplicationForm(ctx);
        return;
      } catch (error) {
        console.error("AI ERROR:", error);
        await ctx.reply("❌ AI orqali ariza tayyorlashda xatolik yuz berdi.");
        return;
      }
    }

    if (form.step === "copyApplicantFullName") {
      form.applicantFullName = text;
      form.step = "copyPhone";
      return ctx.reply("Telefon raqamingizni kiriting:");
    }

    if (form.step === "copyPhone") {
      form.phone = text;
      form.step = "copyAddress";
      return ctx.reply("Manzilingizni kiriting:");
    }

    if (form.step === "copyAddress") {
      form.address = text;
      form.step = "copyCaseNumber";
      return ctx.reply("Ish raqamini kiriting:");
    }

    if (form.step === "copyCaseNumber") {
      form.caseNumber = text;
      form.step = "copyRequestedDocs";
      return ctx.reply(
        "Qaysi ish hujjatlaridan nusxa olmoqchisiz?\n\nMasalan:\nSud majlisi bayonnomasi, hukm nusxasi, qaror nusxasi"
      );
    }

    if (form.step === "copyRequestedDocs") {
      form.requestedDocs = text;
      form.step = "copyReason";
      return ctx.reply(
        "Nusxa olish sababini kiriting:\n\nMasalan:\nShikoyat berish uchun, advokatga taqdim etish uchun"
      );
    }

    if (form.step === "copyReason") {
      form.reason = text;
      form.step = "signature";

      return ctx.reply(
        "Endi imzo qo‘ying. Tugmani bosib imzo oynasini oching.",
        signatureKeyboard()
      );
    }

    if (text === menuButtons.finishPhotos) {
      if (form.step !== "passportPhotos") {
        return ctx.reply("Avval rasm yuborish bosqichiga keling.");
      }

      if (!Array.isArray(form.passportPhotos) || !form.passportPhotos.length) {
        return ctx.reply("Avval kamida bitta pasport rasmini yuboring.");
      }

      form.step = "signature";

      return ctx.reply(
        "Endi imzo qo‘ying. Tugmani bosib imzo oynasini oching.",
        signatureKeyboard()
      );
    }

    if (text === menuButtons.finishApplication) {
      if (form.step !== "signature") {
        return ctx.reply("Avval imzo bosqichiga o‘ting.");
      }

      if (!form.signature) {
        form.signature = "test-signature";
      }

      try {
        await ctx.reply("PDF tayyorlanmoqda... ⏳");

        const filePath = await generateApplicationPdf(form, bot);

        await ctx.replyWithDocument({ source: filePath });
        await ctx.reply("Tayyor PDF yuborildi.", mainMenu());

        resetApplicationForm(ctx);
      } catch (err) {
        console.error("PDF xatolik:", err);
        await ctx.reply("PDF yaratishda xatolik yuz berdi.", mainMenu());
      }

      return;
    }

    if (
      text === "/start" ||
      text === menuButtons.appeal ||
      text === menuButtons.application ||
      text === menuButtons.courtsInfo ||
      text === menuButtons.back ||
      text === menuButtons.openSignature ||
      applicationCourtTypes.includes(text) ||
      applicationTypes.includes(text) ||
      allCourts.includes(text)
    ) {
      return next();
    }

    if (form.step === "applicantFullName") {
      form.applicantFullName = text;
      form.step = "phone";
      return ctx.reply("Telefon raqamingizni kiriting:");
    }

    if (form.step === "phone") {
      form.phone = text;
      form.step = "address";
      return ctx.reply("Manzilingizni kiriting:");
    }

    if (form.step === "address") {
      form.address = text;
      form.step = "defendantFullName";
      return ctx.reply("Sudlanuvchining F.I.Sh ni kiriting:");
    }

    if (form.step === "defendantFullName") {
      form.defendantFullName = text;
      form.step = "visitorsCount";
      return ctx.reply(
        "Uchrashuvga nechta odam kiradi? Faqat 1 dan 3 gacha son kiriting:"
      );
    }

    if (form.step === "visitorsCount") {
      const count = Number(text);

      if (!Number.isInteger(count) || count < 1 || count > 3) {
        return ctx.reply("Noto‘g‘ri son. Faqat 1, 2 yoki 3 kiriting.");
      }

      form.visitorsCount = count;
      form.visitors = [];
      form.step = "visitorName";

      return ctx.reply("1-odamning F.I.Sh ni kiriting:");
    }

    if (form.step === "visitorName") {
      form.visitors.push({
        name: text,
        relation: "",
      });

      form.step = "visitorRelation";
      return ctx.reply("Bu shaxs sudlanuvchiga kim bo‘ladi?");
    }

    if (form.step === "visitorRelation") {
      const currentIndex = form.visitors.length - 1;
      form.visitors[currentIndex].relation = text;

      if (form.visitors.length < form.visitorsCount) {
        form.step = "visitorName";
        return ctx.reply(
          `${form.visitors.length + 1}-odamning F.I.Sh ni kiriting:`
        );
      }

      form.step = "meetingDate";
      return ctx.reply("Uchrashuv sanasini kiriting:");
    }

    if (form.step === "meetingDate") {
      form.meetingDate = text;
      form.step = "passportPhotos";

      if (!Array.isArray(form.passportPhotos)) {
        form.passportPhotos = [];
      }

      return ctx.reply(
        "Pasport rasmlarini yuboring. Tugatgach pastdagi tugmani bosing.",
        finishPhotosKeyboard()
      );
    }

    return next();
  });
}

module.exports = { registerApplication };