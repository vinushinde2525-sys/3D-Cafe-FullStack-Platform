const nodemailer = require('nodemailer');

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT === '465',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

const emailTemplates = {
  verifyEmail: (name, url) => ({
    subject: '✅ Verify Your 3D Café Account',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#1a1209;color:#e8d5b7;padding:40px;border-radius:12px;">
        <h1 style="color:#d4a853;font-size:28px;">Welcome to 3D Café, ${name}!</h1>
        <p>Click below to verify your email address:</p>
        <a href="${url}" style="display:inline-block;background:#d4a853;color:#1a1209;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;margin:20px 0;">Verify Email</a>
        <p style="color:#9b7e5a;font-size:12px;">Link expires in 24 hours. If you didn't create this account, ignore this email.</p>
      </div>`,
  }),
  resetPassword: (name, url) => ({
    subject: '🔑 Reset Your 3D Café Password',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#1a1209;color:#e8d5b7;padding:40px;border-radius:12px;">
        <h1 style="color:#d4a853;">Password Reset Request</h1>
        <p>Hi ${name}, click below to reset your password:</p>
        <a href="${url}" style="display:inline-block;background:#d4a853;color:#1a1209;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;margin:20px 0;">Reset Password</a>
        <p style="color:#9b7e5a;font-size:12px;">Link expires in 30 minutes.</p>
      </div>`,
  }),
  orderConfirmation: (name, orderNumber, total) => ({
    subject: `🍕 Order Confirmed - ${orderNumber}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#1a1209;color:#e8d5b7;padding:40px;border-radius:12px;">
        <h1 style="color:#d4a853;">Order Confirmed!</h1>
        <p>Hi ${name}, your order <strong>${orderNumber}</strong> has been received.</p>
        <p>Total: <strong style="color:#d4a853;">₹${total}</strong></p>
        <p>You'll receive real-time updates as your order progresses. Thank you for ordering from 3D Café!</p>
      </div>`,
  }),
};

const sendEmail = async ({ to, templateName, templateData, subject, html }) => {
  try {
    const transporter = createTransporter();
    let mailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to,
    };
    if (templateName && emailTemplates[templateName]) {
      const tpl = emailTemplates[templateName](...Object.values(templateData));
      mailOptions = { ...mailOptions, ...tpl };
    } else {
      mailOptions = { ...mailOptions, subject, html };
    }
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Email send error:', error.message);
    throw error;
  }
};

module.exports = { sendEmail, emailTemplates };
