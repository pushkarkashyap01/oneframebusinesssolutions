
const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    const { name, email, subject, message, website } = req.body || {};

    // Spam protection
    if (website) {
      return res.status(200).send("OK");
    }

    if (!name || !email || !subject || !message) {
      return res.status(400).send("Please complete all fields.");
    }

    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return res.status(400).send("Invalid email address.");
    }

    if (
      [name, email, subject, message].some(
        value => typeof value !== "string" || value.length > 5000
      )
    ) {
      return res.status(400).send("Invalid form data.");
    }

    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS ||
      !process.env.CONTACT_TO
    ) {
      console.error("SMTP environment variables are missing.");
      return res.status(500).send("Email service is not configured.");
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"One Frame Website" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO,
      replyTo: email,
      subject: `Website Enquiry: ${subject}`,
      text: `
New enquiry received from your website.

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `
    });

    return res.status(200).send("OK");

  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).send(
      "Unable to send your enquiry. Please try again."
    );
  }
};
