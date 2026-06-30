export declare class MailerService {
    private transporter;
    private getTransporter;
    sendMail(to: string, subject: string, html: string): Promise<void>;
}
