import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, subject, message } = await req.json();

    // Configure Gmail transporter securely
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "digimartcontactus@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD, // your app password
      },
      tls: {
        rejectUnauthorized: false, // ✅ Fix for "self-signed certificate in certificate chain"
      },
    });

    // 1️⃣ Send message to Digimart inbox
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: "digimartcontactus@gmail.com",
      subject: `Contact Form: ${subject}`,
      text: `From: ${name} (${email})\n\n${message}`,
    });

    // 2️⃣ Send confirmation email to the user
    await transporter.sendMail({
      from: "digimartcontactus@gmail.com",
      to: email,
      subject: "We've received your message - DigiMart Support",
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px;background:#f8f9fa;border-radius:10px">
          <h2>Hi ${name},</h2>
          <p>Thanks for reaching out to DigiMart. Your query has been received successfully.</p>
          <p>Our support team will get back to you soon regarding: <b>${subject}</b></p>
          <hr/>
          <p>Best regards,<br/>DigiMart Support Team</p>
          <a href="https://digimart-lime.vercel.app" 
             style="display:inline-block;margin-top:10px;padding:10px 20px;background:#3B82F6;color:#fff;text-decoration:none;border-radius:8px">
             Visit Website
          </a>
        </div>
      `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Email sending failed:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
