/* src/utils/emailService.js */
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

/**
 * Sends an email notification to a user.
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML formatted email body
 */
const sendEmail = async (to, subject, htmlContent) => {
    try {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn('⚠️ SMTP credentials not configured. Skipping email dispatch.');
            return;
        }

        const info = await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
            to: to,
            subject: subject,
            html: htmlContent
        });

        console.log(`✉️ Email sent to ${to}: ${info.messageId}`);
    } catch (error) {
        console.error('❌ Error sending email:', error);
    }
};

/**
 * Generates and sends a professional booking decision email.
 */
const sendBookingDecisionEmail = async (to, userName, bookingId, status, remarks) => {
    const isApproved = status === 'approved';
    const color = isApproved ? '#10b981' : '#ef4444';
    const title = isApproved ? 'Booking Approved' : 'Booking Rejected';
    const actionText = isApproved ? 'has been successfully approved' : 'was unfortunately rejected';

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: ${color}; padding: 20px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 24px;">${title}</h1>
            </div>
            <div style="padding: 30px; background-color: #f8fafc; color: #334155;">
                <p style="font-size: 16px;">Dear <strong>${userName}</strong>,</p>
                <p style="font-size: 16px; line-height: 1.5;">
                    Your booking request (ID: <strong>#${bookingId}</strong>) ${actionText}.
                </p>
                
                <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid ${color}; margin-top: 20px;">
                    <p style="margin: 0; font-size: 14px; color: #64748b;"><strong>Admin Remarks:</strong></p>
                    <p style="margin: 5px 0 0 0; font-style: italic;">"${remarks || 'No remarks provided.'}"</p>
                </div>

                <p style="margin-top: 30px; font-size: 14px; color: #94a3b8;">
                    If you have any questions, please contact the administration office.
                </p>
            </div>
            <div style="background-color: #1e293b; padding: 15px; text-align: center; color: #94a3b8; font-size: 12px;">
                &copy; ${new Date().getFullYear()} Resource Allocation System. All rights reserved.
            </div>
        </div>
    `;

    await sendEmail(to, `Booking Request #${bookingId} - ${title}`, htmlContent);
};

module.exports = {
    sendEmail,
    sendBookingDecisionEmail
};
