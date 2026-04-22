const { courtTypes, districts, menuButtons } = require("../config/constants");
const { districtKeyboard, mainMenu } = require("../keyboards/keyboards");
const { saveAppeal } = require("../services/appealService");
const { resetForm } = require("../utils/helpers");
const { getGroupId } = require("../config/routes");

function registerForm(bot) {
    bot.hears(courtTypes, (ctx, next) => {
        if (ctx.session.applicationForm?.step) return next();
        if (!ctx.session.form || ctx.session.form.step !== "courtType") return next();

        ctx.session.form.courtType = ctx.message.text;
        ctx.session.form.step = "district";
        return ctx.reply("Tumanni tanlang:", districtKeyboard());
    });

    bot.hears(districts, (ctx, next) => {
        if (ctx.session.applicationForm?.step) return next();
        if (!ctx.session.form || ctx.session.form.step !== "district") return next();

        ctx.session.form.district = ctx.message.text;
        ctx.session.form.step = "fullName";
        return ctx.reply("F.I.O kiriting:");
    });

    bot.on("text", async (ctx, next) => {
        if (ctx.session.applicationForm?.step) return next();

        const form = ctx.session.form;
        const text = ctx.message.text;

        if (
            text === "/start" ||
            text === menuButtons?.appeal ||
            text === menuButtons?.application ||
            text === menuButtons?.courtsInfo ||
            text === menuButtons?.back ||
            text === menuButtons?.finishPhotos ||
            courtTypes.includes(text) ||
            districts.includes(text)
        ) {
            return next();
        }

        if (!form?.step) return next();

        if (form.step === "fullName") {
            form.fullName = text;
            form.step = "phone";
            return ctx.reply("Telefon kiriting:");
        }

        if (form.step === "phone") {
            form.phone = text;
            form.step = "address";
            return ctx.reply("Manzil kiriting:");
        }

        if (form.step === "address") {
            form.address = text;
            form.step = "message";
            return ctx.reply("Murojaat yozing:");
        }

        if (form.step === "message") {
            form.message = text;

            try {
                const appealNumber = await saveAppeal(form, String(ctx.from.id));

                const groupText = `
🆕 Yangi murojaat

ID: ${appealNumber}
Sud turi: ${form.courtType}
Tuman: ${form.district}

F.I.O: ${form.fullName}
Tel: ${form.phone}

Manzil: ${form.address}

Murojaat:
${form.message}
`;

                const targetGroupId = getGroupId(form.district, form.courtType);

                if (targetGroupId) {
                    try {
                        await bot.telegram.sendMessage(targetGroupId, groupText);
                    } catch (err) {
                        console.error(
                            "Groupga yuborishda xato:",
                            err.response?.description || err.message
                        );
                    }
                } else {
                    console.log("Group ID topilmadi:", form.district, form.courtType);
                }

                await ctx.reply(
                    `✅ Murojaatingiz qabul qilindi.\n\nID: ${appealNumber}`,
                    mainMenu()
                );

                resetForm(ctx);
            } catch (error) {
                console.error("Xatolik:", error);
                await ctx.reply("Xatolik yuz berdi.", mainMenu());
                resetForm(ctx);
            }

            return;
        }

        return next();
    });
}

module.exports = { registerForm };