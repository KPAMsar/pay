import Email from "@sojipay/core/email/Email";
import { User } from "@sojipay/models/User";
import { sendSMS } from "@sojipay/util/sms";

export function trimPhone(phone: string) {
    if (phone[0] == '0') {
        phone = phone.split('').slice(1).join('');
    }

    return phone;
}

export const buildV1AppPath = (path: string) => {
    return `/api/v1/${path}`;
}

export const sendUserOTP = async (user: User, otp: string) => {
    const message = `<h2>Hello ${user.first_name}</h2><p>Verify your account with ${otp}</p`;
    const subject = 'Account Verification';
    await Email.init().send(user.email, subject, message);
}