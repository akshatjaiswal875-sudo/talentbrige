import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // or your preferred service
  auth: {
    user: "ayushrajyadav951@gmail.com", // Your email
    pass: "nuyq kvvp ffvn pgey", // Your app password
  },
});

export async function sendAdminNotification(userEmail: string, userName: string, courseTitle: string, utr: string, amount: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("⚠️ SMTP credentials missing. Skipping email.");
    console.log(`[MOCK EMAIL TO ADMIN] User: ${userEmail}, Course: ${courseTitle}, UTR: ${utr}`);
    return;
  }

  const mailOptions = {
    from: process.env.SMTP_USER,
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

  await transporter.sendMail(mailOptions);
}

export async function sendAccessGrantedEmail(userEmail: string, courseTitle: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("⚠️ SMTP credentials missing. Skipping email.");
    console.log(`[MOCK EMAIL TO USER] To: ${userEmail}, Access Granted for: ${courseTitle}`);
    return;
  }

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: userEmail,
    subject: `Course Access Granted: ${courseTitle}`,
    html: `
      <h2>Payment Verified!</h2>
      <p>Your payment for <strong>${courseTitle}</strong> has been verified.</p>
      <p>You now have full access to the course content.</p>
      <p><strong>Join our WhatsApp group for live classes and updates:</strong></p>
      <p><a href="https://chat.whatsapp.com/G51GrMSxwReFD0cbyyKkWE?mode=hqrt2">Join WhatsApp Group</a></p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/learning">Go to My Courses</a></p>
      <br/>
      <p>Happy Learning!</p>
      <p>Team TalentBridge</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}
