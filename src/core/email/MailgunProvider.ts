import EmailProvider from "@sojipay/core/email/contract/EmailProvider";
import Mailgun from "mailgun.js";
import FormData from "form-data";

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY!});

class MailgunProvider implements EmailProvider {
    public async send(recipientEmail: string, subject: string, message: string): Promise<void> {
        
        await mg.messages.create('coinbubble.io', {
            from: process.env.MAIL_FROM,
            to: [recipientEmail],
            subject: subject,
            html: message
        })
    }
}

export default MailgunProvider;