import nodemailer from 'nodemailer';

const SMTP_USER = process.env.SMTP_USER || "ayushrajyadav951@gmail.com";
const SMTP_PASS = process.env.SMTP_PASS || "nuyq kvvp ffvn pgey";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export async function sendAdminNotification(userEmail: string, userName: string, courseTitle: string, utr: string, amount: string) {
  if (!SMTP_USER || !SMTP_PASS) {
    console.log("⚠️ SMTP credentials missing. Skipping email.");
    console.log(`[MOCK EMAIL TO ADMIN] User: ${userEmail}, Course: ${courseTitle}, UTR: ${utr}`);
    return;
  }

  const mailOptions = {
    from: SMTP_USER,
    to: "akshatjaiswal875@gmail.com",
    subject: `New Payment Request: ${courseTitle}`,
    html: `
      <h2>New Payment Request</h2>
      <p><strong>User:</strong> ${userName} (${userEmail})</p>
      <p><strong>Course:</strong> ${courseTitle}</p>
      <p><strong>Amount:</strong> ${amount}</p>
      <p><strong>UTR/Transaction ID:</strong> ${utr}</p>
      <p>Please verify this payment in the Admin Dashboard and grant access.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending admin notification:", error);
  }
}

export async function sendAccessGrantedEmail(userEmail: string, courseTitle: string) {
  if (!SMTP_USER || !SMTP_PASS) {
    console.log("⚠️ SMTP credentials missing. Skipping email.");
    console.log(`[MOCK EMAIL TO USER] To: ${userEmail}, Access Granted for: ${courseTitle}`);
    return;
  }

  const mailOptions = {
    from: SMTP_USER,
    to: userEmail,
    subject: `Course Access Granted: ${courseTitle}`,
    html: `
      <h2>Payment Verified!</h2>
      <p>Your payment for <strong>${courseTitle}</strong> has been verified.</p>
      <p>You now have full access to the course content.</p>
      <p><strong>Join our WhatsApp group for live classes and updates:</strong></p>
      <p><a href="https://chat.whatsapp.com/G51GrMSxwReFD0cbyyKkWE?mode=hqrt2">Join WhatsApp Group</a></p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/learning">Go to My Courses</a></p>
      <br/>
      <p>Happy Learning!</p>
      <p>Team TalentBridge</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending access granted email:", error);
  }
}
