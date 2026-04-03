import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import EmailProvider from "@sojipay/core/email/contract/EmailProvider";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

class SendgridProvider implements EmailProvider {
    public async send(recipientEmail: string, subject: string, message: string): Promise<void> {
        const msg = {
            to: recipientEmail,
            from: process.env.MAIL_FROM!, // Use the email address or domain you verified above
            subject: subject,
            html: message,
        };

        await sgMail.send(msg);
    }
}

export default SendgridProvider;