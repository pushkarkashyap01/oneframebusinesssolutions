
const nodemailer = require("nodemailer");

module.exports = async (req, res) => {

  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {

    const { email, website } = req.body || {};

    // Basic spam protection
    if (website) {
      return res.status(200).send("OK");
    }

    // Check required email
    if (!email || typeof email !== "string") {
      return res.status(400).send("Please enter your email address.");
    }

    const subscriberEmail = email.trim();

    // Validate email format
    if (
      subscriberEmail.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subscriberEmail)
    ) {
      return res.status(400).send("Please enter a valid email address.");
    }

    // Verify SMTP configuration
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS ||
      !process.env.CONTACT_TO
    ) {
      console.error("Newsletter SMTP configuration is missing.");

      return res.status(500).send(
        "Newsletter service is not configured."
      );
    }

    // Configure GoDaddy Professional Email
    const transporter = nodemailer.createTransport({

      host: process.env.SMTP_HOST,

      port: Number(process.env.SMTP_PORT || 465),

      secure: true,

      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }

    });

    // Send notification to One Frame
    await transporter.sendMail({

      from: `"One Frame Website" <${process.env.SMTP_USER}>`,

      to: process.env.CONTACT_TO,

      replyTo: subscriberEmail,

      subject: "New Newsletter Subscription - One Frame",

      text: `
A new visitor has subscribed to the One Frame newsletter.

Subscriber Email: ${subscriberEmail}

This subscription was submitted through the website newsletter form.
      `

    });

    return res.status(200).send("OK");

  } catch (error) {

    console.error("Newsletter subscription error:", error);

    return res.status(500).send(
      "Unable to process your subscription. Please try again."
    );

  }

};
