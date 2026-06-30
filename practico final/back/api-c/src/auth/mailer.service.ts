import * as nodemailer from 'nodemailer';

export class MailerService {
  private transporter: nodemailer.Transporter | null = null;

  private async getTransporter(): Promise<nodemailer.Transporter> {
    if (this.transporter) return this.transporter;

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

    // Fallback: create an Ethereal test account so developers can inspect messages
    const testAccount = await (nodemailer as any).createTestAccount();
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    return this.transporter;
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      const transporter = await this.getTransporter();
      const info = await transporter.sendMail({
        from: process.env.FROM_EMAIL || 'no-reply@example.com',
        to,
        subject,
        html,
      });

      // If using Ethereal, log preview URL
      const preview = (nodemailer as any).getTestMessageUrl
        ? (nodemailer as any).getTestMessageUrl(info)
        : undefined;
      // eslint-disable-next-line no-console
      console.log(`MailerService: sent mail to=${to} subject=${subject} preview=${preview || 'N/A'}`);
    } catch (err: any) {
      // Don't fail requests if SMTP is not reachable in local/dev environments
      // eslint-disable-next-line no-console
      console.warn('MailerService: failed to send mail (ignored in dev):', err?.message || err);
    }
  }
}
