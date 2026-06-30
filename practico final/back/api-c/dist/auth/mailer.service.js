"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerService = void 0;
const nodemailer = require("nodemailer");
class MailerService {
    transporter = null;
    async getTransporter() {
        if (this.transporter)
            return this.transporter;
        const host = process.env.SMTP_HOST;
        if (host) {
            const secure = process.env.SMTP_SECURE === 'true';
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT || 587),
                secure,
                auth: process.env.SMTP_USER
                    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
                    : undefined,
            });
            return this.transporter;
        }
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: { user: testAccount.user, pass: testAccount.pass },
        });
        return this.transporter;
    }
    async sendMail(to, subject, html) {
        try {
            const transporter = await this.getTransporter();
            const info = await transporter.sendMail({
                from: process.env.FROM_EMAIL || 'no-reply@example.com',
                to,
                subject,
                html,
            });
            const preview = nodemailer.getTestMessageUrl
                ? nodemailer.getTestMessageUrl(info)
                : undefined;
            console.log(`MailerService: sent mail to=${to} subject=${subject} preview=${preview || 'N/A'}`);
        }
        catch (err) {
            console.warn('MailerService: failed to send mail (ignored in dev):', err?.message || err);
        }
    }
}
exports.MailerService = MailerService;
//# sourceMappingURL=mailer.service.js.map