import EmailProvider from "@sojipay/core/email/contract/EmailProvider";
import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const SES_CONFIG: AWS.SES.ClientConfiguration = {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
    region: process.env.AWS_REGION!,
    signatureVersion: 'v4',
};

const AWS_SES = new AWS.SES(SES_CONFIG);

class AWSProvider implements EmailProvider {
    public async send(recipientEmail: string, subject: string, message: string): Promise<void> {
        let params = {
            Source: process.env.MAIL_FROM!,
            Destination: {
                ToAddresses: [
                    recipientEmail
                ],
            },
            ReplyToAddresses: [],
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: message,
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: subject,
                }
            },
        };
        await AWS_SES.sendEmail(params).promise();
    }
}

export default AWSProvider;