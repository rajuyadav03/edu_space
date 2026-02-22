import nodemailer from 'nodemailer';

/**
 * Create reusable transporter using Gmail SMTP
 * For production, use a dedicated email service (SendGrid, Resend, AWS SES)
 */
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });
};

/**
 * Send password reset email
 * @param {string} to - Recipient email
 * @param {string} resetUrl - Password reset URL
 */
export const sendPasswordResetEmail = async (to, resetUrl) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"EduSpace" <${process.env.SMTP_EMAIL}>`,
        to,
        subject: 'EduSpace - Password Reset Request',
        html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">EduSpace</h1>
          <p style="color: #a0a0a0; margin: 8px 0 0; font-size: 14px;">Password Reset Request</p>
        </div>
        <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e5e5; border-top: none;">
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
            Hi there,
          </p>
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
            We received a request to reset the password for your EduSpace account. Click the button below to set a new password:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="display: inline-block; background: #1a1a1a; color: #ffffff; padding: 14px 40px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 20px 0 0;">
            This link will expire in <strong>15 minutes</strong>.
          </p>
          <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 10px 0 0;">
            If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px; line-height: 1.6; margin: 0;">
            If the button doesn't work, copy and paste this link into your browser:<br/>
            <a href="${resetUrl}" style="color: #666; word-break: break-all;">${resetUrl}</a>
          </p>
        </div>
        <div style="background: #f9f9f9; padding: 20px 30px; text-align: center; border-radius: 0 0 12px 12px; border: 1px solid #e5e5e5; border-top: none;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} EduSpace. All rights reserved.
          </p>
        </div>
      </div>
    `
    };

    await transporter.sendMail(mailOptions);
};

export default { sendPasswordResetEmail };
