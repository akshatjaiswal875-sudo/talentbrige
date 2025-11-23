const nodemailer = require("nodemailer");

const SMTP_USER = process.env.SMTP_USER || "ayushrajyadav951@gmail.com";
const SMTP_PASS = process.env.SMTP_PASS || "nuyq kvvp ffvn pgey";

async function main() {
  console.log("SMTP_USER:", SMTP_USER ? `${SMTP_USER.slice(0, 3)}***` : "<missing>");
  if (!SMTP_USER || !SMTP_PASS) {
    console.error("Missing SMTP credentials. Email will not work.");
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log("✅ SMTP credentials verified successfully.");
  } catch (err) {
    console.error("❌ SMTP verification failed:", err.message || err);
    process.exit(1);
  }
}

main();
