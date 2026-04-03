import dotenv from 'dotenv';
import EmailProvider from '@sojipay/core/email/contract/EmailProvider';
import AWSProvider from '@sojipay/core/email/AWSProvider';
import SendgridProvider from '@sojipay/core/email/SendgridProvider';
import MailgunProvider from '@sojipay/core/email/MailgunProvider';

dotenv.config();

class Email {
    static init(): EmailProvider {
        const provider = process.env.EMAIL_PROVIDER;
        
        if(provider === 'aws') {
            return new AWSProvider();
        }else if(provider === 'sendgrid') {
            return new SendgridProvider();
        }else if(provider === 'mailgun'){
            return new MailgunProvider();
        }else{
            throw new Error('Invalid email provider');
        }
    }
}

export default Email;