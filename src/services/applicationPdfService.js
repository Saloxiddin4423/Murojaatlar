const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

async function generateApplicationPdf(form, bot) {
  const fileName = `ariza_${Date.now()}.pdf`;
  const filePath = path.join(__dirname, "../../", fileName);

  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(filePath));

  doc.font("Helvetica");
  doc.fontSize(11);

  doc.text(
    `${form.district} tuman jinoyat ishlari bo‘yicha sudiga`,
    { align: "right" }
  );

  doc.moveDown(0.5);

  doc.text(`Ariza beruvchi: ${form.applicantFullName}`, {
    align: "right",
  });
  doc.text(`Tel: ${form.phone}`, { align: "right" });
  doc.text(`Manzil: ${form.address}`, { align: "right" });

  doc.moveDown(2);

  doc.fontSize(16).text("ARIZA", { align: "center" });

  doc.moveDown(1.5);
  doc.font("Helvetica");
  doc.fontSize(12);

  if (form.applicationType === "Sudlanuvchi bilan uchrashuvga ruxsat") {
    doc.text(
      `Men, ${form.applicantFullName}, ${form.defendantFullName} bilan uchrashish uchun ruxsat berishingizni so‘rayman.`
    );
    doc.moveDown(0.5);
    doc.text(`Sudlanuvchi menga: ${form.relationship}`);
    doc.moveDown(0.5);
    doc.text(`Uchrashuv sanasi: ${form.meetingDate}`);
  }

  if (form.applicationType === "Ish hujjatlari bilan tanishish") {
    doc.text(
      `Men, ${form.applicantFullName}, ${form.defendantFullName} ga oid ish hujjatlari bilan tanishishga ruxsat berishingizni so‘rayman.`
    );
    doc.moveDown(0.5);
    doc.text(`Sudlanuvchi menga: ${form.relationship}`);
    doc.moveDown(0.5);
    doc.text(`Sabab: ${form.reviewReason}`);
  }

  doc.moveDown(2);

  doc.font("Helvetica-Bold").text("SO‘RAYMAN:", { align: "left" });
  doc.font("Helvetica");

  if (form.applicationType === "Sudlanuvchi bilan uchrashuvga ruxsat") {
    doc.text(
      `1. ${form.defendantFullName} bilan uchrashish uchun ruxsat berishingizni so‘rayman.`
    );
  }

  if (form.applicationType === "Ish hujjatlari bilan tanishish") {
    doc.text(
      `1. ${form.defendantFullName} ga oid ish hujjatlari bilan tanishishga ruxsat berishingizni so‘rayman.`
    );
  }

  doc.moveDown(2);

  const dateY = doc.y;
  doc.text(`Sana: ${new Date().toLocaleDateString()}`, 50, dateY);
  doc.text("Imzo:", 50, dateY + 25);

  if (form.signature) {
    try {
      const base64Data = form.signature.replace(/^data:image\/png;base64,/, "");
      const signatureBuffer = Buffer.from(base64Data, "base64");

      doc.image(signatureBuffer, 95, dateY + 15, {
        width: 120,
        height: 45,
      });
    } catch (error) {
      console.error("Imzoni PDFga joylashda xato:", error);
      doc.text("_____________________", 95, dateY + 25);
    }
  } else {
    doc.text("_____________________", 95, dateY + 25);
  }

  if (Array.isArray(form.passportPhotos)) {
    for (const fileId of form.passportPhotos) {
      const file = await bot.telegram.getFile(fileId);
      const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;

      const response = await axios.get(fileUrl, {
        responseType: "arraybuffer",
      });

      const imgBuffer = Buffer.from(response.data);

      doc.addPage();
      doc.image(imgBuffer, {
        fit: [500, 700],
        align: "center",
        valign: "center",
      });
    }
  }

  doc.end();

  return filePath;
}

module.exports = { generateApplicationPdf };