interface EmailProvider {
    send(recipientEmail: string, subject: string, message: string): Promise<void>;
}

export default EmailProvider;