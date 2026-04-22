const {
  applicationCourtTypes,
  applicationTypes,
  districts,
  menuButtons
} = require("../config/constants");

const {
  criminalDistrictKeyboard,
  applicationTypesKeyboard,
  finishPhotosKeyboard,
  signatureKeyboard,
  mainMenu
} = require("../keyboards/keyboards");

const { resetApplicationForm } = require("../utils/helpers");
const { generateApplicationPdf } = require("../services/applicationPdfService");

function registerApplication(bot) {
  bot.hears(applicationCourtTypes, async (ctx) => {
    const form = ctx.session.applicationForm;
    if (!form || form.step !== "courtType") return;

    if (ctx.message.text !== "Jinoyat") {
      return ctx.reply("Hozircha faqat jinoyat ishlari bo‘yicha arizalar mavjud.");
    }

    form.courtType = ctx.message.text;
    form.step = "district";

    return ctx.reply(
      "Jinoyat ishlari bo‘yicha tuman sudini tanlang:",
      criminalDistrictKeyboard()
    );
  });

  bot.hears(districts, async (ctx) => {
    const form = ctx.session.applicationForm;
    if (!form || form.step !== "district") return;

    form.district = ctx.message.text;
    form.step = "applicationType";

    return ctx.reply("Ariza turini tanlang:", applicationTypesKeyboard());
  });

  bot.hears(applicationTypes, async (ctx) => {
    const form = ctx.session.applicationForm;
    if (!form || form.step !== "applicationType") return;

    form.applicationType = ctx.message.text;
    form.step = "applicantFullName";

    return ctx.reply("F.I.Sh kiriting:");
  });

  bot.hears(menuButtons.finishPhotos, async (ctx) => {
    const form = ctx.session.applicationForm;
    if (!form || form.step !== "passportPhotos") return;

    if (!form.passportPhotos.length) {
      return ctx.reply("Avval kamida bitta pasport rasmini yuboring.");
    }

    form.step = "signature";

    return ctx.reply(
      "Endi imzo qo‘ying. Tugmani bosib imzo oynasini oching.",
      signatureKeyboard()
    );
  });

  bot.hears(menuButtons.finishApplication, async (ctx) => {
    const form = ctx.session.applicationForm;
    if (!form || form.step !== "signature") return;

    if (!form.signature) {
      return ctx.reply("Avval imzo qo‘ying.");
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
  });

  bot.on("photo", async (ctx, next) => {
    const form = ctx.session.applicationForm;
    if (!form || form.step !== "passportPhotos") return next();

    const photos = ctx.message.photo;
    const largest = photos[photos.length - 1];

    form.passportPhotos.push(largest.file_id);

    return ctx.reply(
      `Rasm qabul qilindi. Jami: ${form.passportPhotos.length} ta\nYana rasm yuboring yoki tugmani bosing.`,
      finishPhotosKeyboard()
    );
  });

  bot.on("message", async (ctx, next) => {
    const form = ctx.session.applicationForm;

    if (!ctx.message.web_app_data) return next();
    if (!form || form.step !== "signature") return next();

    try {
      const data = JSON.parse(ctx.message.web_app_data.data);

      if (data.type === "signature" && data.image) {
        form.signature = data.image;

        return ctx.reply(
          "Imzo saqlandi. Endi PDF tayyorlash tugmasini bosing.",
          signatureKeyboard()
        );
      }
    } catch (error) {
      console.error("WebApp data parse xato:", error);
      return ctx.reply("Imzoni qabul qilishda xatolik yuz berdi.");
    }

    return next();
  });

  bot.on("text", async (ctx, next) => {
    const form = ctx.session.applicationForm;
    const text = ctx.message.text;

    if (
      !form ||
      !form.step ||
      text === "/start" ||
      text === menuButtons.appeal ||
      text === menuButtons.application ||
      text === menuButtons.courtsInfo ||
      text === menuButtons.back ||
      text === menuButtons.finishPhotos ||
      text === menuButtons.finishApplication ||
      text === menuButtons.openSignature ||
      applicationCourtTypes.includes(text) ||
      applicationTypes.includes(text) ||
      districts.includes(text)
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
      form.step = "relationship";
      return ctx.reply("Sudlanuvchi sizga kim bo‘ladi?");
    }

    if (form.step === "relationship") {
      form.relationship = text;

      if (form.applicationType === "Ish hujjatlari bilan tanishish") {
        form.step = "reviewReason";
        return ctx.reply("Ish hujjatlari bilan tanishish sababini yozing:");
      }

      form.step = "meetingDate";
      return ctx.reply("Uchrashuv sanasini oddiy matn ko‘rinishida kiriting:");
    }

    if (form.step === "meetingDate") {
      form.meetingDate = text;
      form.step = "passportPhotos";
      return ctx.reply(
        "Pasport rasmlarini yuboring. Tugatgach pastdagi tugmani bosing.",
        finishPhotosKeyboard()
      );
    }

    if (form.step === "reviewReason") {
      form.reviewReason = text;
      form.step = "passportPhotos";
      return ctx.reply(
        "Pasport rasmlarini yuboring. Tugatgach pastdagi tugmani bosing.",
        finishPhotosKeyboard()
      );
    }

    return next();
  });
}

module.exports = { registerApplication };