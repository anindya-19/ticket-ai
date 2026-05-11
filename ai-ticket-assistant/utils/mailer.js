import nodemailer from "nodemailer";

export const sendMail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_SMTP_HOST,
      port: process.env.MAILTRAP_SMTP_PORT,
      secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
      auth: {
        user: process.env.MAILTRAP_SMTP_USER,
        pass: process.env.MAILTRAP_SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: "Inngest TMS", // sender address
      to, // list of recipients
      subject, // subject line
      text, // plain text body
    });

    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error(`Mail error: ${error.message}`);
    throw error;
  }
};
