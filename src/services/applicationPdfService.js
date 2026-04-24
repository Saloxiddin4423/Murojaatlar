const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

async function generateApplicationPdf(form, bot) {
  const fileName = `ariza_${Date.now()}.pdf`;
  const filePath = path.join(__dirname, "../../", fileName);

  const fontPath = path.join(__dirname, "../assets/fonts/arial.ttf");
  const boldFontPath = path.join(__dirname, "../assets/fonts/arialbd.ttf");

  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(filePath));

  doc.registerFont("MainFont", fontPath);
  doc.registerFont("MainFontBold", boldFontPath);

  // ================== SHAPKA (faqat o‘ngda) ==================
  const rightX = 300;
  const topY = 70;
  const width = 250;

  doc.font("MainFontBold").fontSize(12);
  doc.text(
    `Jinoyat ishlari bo‘yicha ${form.district} tuman sudi raisiga`,
    rightX,
    topY,
    { width }
  );

  doc.moveDown(1);

  doc.font("MainFont").fontSize(11);
  doc.text(`Ariza beruvchi: ${form.applicantFullName}`, rightX, doc.y, { width });
  doc.text(`Manzil: ${form.address}`, rightX, doc.y + 3, { width });
  doc.text(`Tel: ${form.phone}`, rightX, doc.y + 3, { width });

  // ================== BODY NORMAL HOLATGA QAYTARISH ==================
  doc.x = 50;
  doc.y = 250;

  // ================== TITLE ==================
  doc.font("MainFontBold");
  doc.fontSize(16).text("ARIZA", 50, doc.y, {
    width: 495,
    align: "center",
  });

  doc.moveDown(0.3);

  doc.font("MainFont");
  doc.fontSize(11).text(
    "(sudlanuvchi bilan uchrashuvga ruxsat berish haqida)",
    50,
    doc.y,
    {
      width: 495,
      align: "center",
    }
  );

  doc.moveDown(1.5);

  // ================== BODY ==================
  doc.font("MainFont").fontSize(12);

  doc.text(
    `Men, ${form.applicantFullName}, jinoyat ishlari bo‘yicha ${form.district} tuman sudida ko‘rilayotgan jinoyat ishi doirasida sudlanuvchi ${form.defendantFullName} bilan uchrashishga ruxsat berishingizni so‘rayman.`,
    {
      width: 495,
      align: "justify",
      lineGap: 3,
    }
  );

  doc.moveDown(0.8);

  doc.text(
    "Uchrashuv sud yoki tegishli muassasa tomonidan belgilangan tartib, vaqt va sharoitlarda tashkil etilishiga roziman.",
    {
      width: 495,
      align: "justify",
      lineGap: 3,
    }
  );

  doc.moveDown(0.8);

  doc.font("MainFontBold").text("Uchrashuvda ishtirok etuvchi shaxslar:");
  doc.font("MainFont");

  if (Array.isArray(form.visitors) && form.visitors.length) {
    form.visitors.forEach((visitor, index) => {
      doc.text(
        `${index + 1}. ${visitor.name} — sudlanuvchiga ${visitor.relation}`,
        { width: 495 }
      );
    });
  } else {
    doc.text("1. Ma’lumot kiritilmagan");
  }

  doc.moveDown(0.8);

  doc.text(`Uchrashuv sanasi: ${form.meetingDate}`);

  doc.moveDown(1.5);

  doc.font("MainFontBold").text("SO‘RAYMAN:");
  doc.font("MainFont");

  doc.moveDown(0.5);

  doc.text(
    `1. Sudlanuvchi ${form.defendantFullName} bilan yuqorida ko‘rsatilgan shaxslarning uchrashishiga ruxsat berishingizni.`,
    {
      width: 495,
      align: "justify",
      lineGap: 3,
    }
  );

  doc.moveDown(0.4);

  doc.text(
    "2. Uchrashuvni qonunchilikda belgilangan tartibda tashkil etish yuzasidan tegishli choralar ko‘rishingizni.",
    {
      width: 495,
      align: "justify",
      lineGap: 3,
    }
  );

  doc.moveDown(2);

  // ================== SANA + IMZO ==================
  const dateY = doc.y;

  doc.text(`Sana: ${new Date().toLocaleDateString("uz-UZ")}`, 50, dateY);
  doc.text("Imzo:", 50, dateY + 25);

  if (form.signature && form.signature !== "test-signature") {
    try {
      const base64Data = form.signature.replace(/^data:image\/png;base64,/, "");
      const signatureBuffer = Buffer.from(base64Data, "base64");

      doc.image(signatureBuffer, 95, dateY + 15, {
        width: 120,
        height: 45,
      });
    } catch (error) {
      doc.text("_____________________", 95, dateY + 25);
    }
  } else if (form.signature === "test-signature") {
    doc.fontSize(10).text("TEST MODE", 95, dateY + 25);
  } else {
    doc.text("_____________________", 95, dateY + 25);
  }

  // ================== PASSPORT ==================
  if (Array.isArray(form.passportPhotos)) {
    for (const fileId of form.passportPhotos) {
      const file = await bot.telegram.getFile(fileId);
      const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;

      const response = await axios.get(fileUrl, {
        responseType: "arraybuffer",
      });

      const imgBuffer = Buffer.from(response.data);

      doc.addPage();

      doc.font("MainFontBold").fontSize(14).text("Ilova: hujjat rasmi", {
        align: "center",
      });

      doc.moveDown(1);

      doc.image(imgBuffer, {
        fit: [500, 650],
        align: "center",
        valign: "center",
      });
    }
  }

  doc.end();

  return filePath;
}

module.exports = { generateApplicationPdf };