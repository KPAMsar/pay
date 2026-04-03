import { User } from "@sojipay/models/User";
import { Wallet } from "@sojipay/models/Wallet";
import { sendUserOTP } from "@sojipay/util/helpers";


export const userCreatedEventListener = async (user: User) => {
    const otpData = await user.generateOTP();

    await sendUserOTP(user, otpData.otp);
}

export const userVerified = async (user: User) => {
    await Wallet.create({
        balance: 0,
        user_id: user.id
    });
}