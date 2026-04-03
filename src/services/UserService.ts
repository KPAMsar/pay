import ErrorResponse from "@sojipay/constants/ErrorResponse";
import StatusCodes from "@sojipay/constants/enums/StatusCodes";
import { User } from "@sojipay/models/User";
import bcrypt from 'bcryptjs';
import { sendUserOTP, trimPhone } from "@sojipay/util/helpers";
import jwt from 'jsonwebtoken';
import { OtpVerification } from "@sojipay/models/OtpVerification";
import { OTPTypes, SessionMethods } from "@sojipay/constants/enums/User";
import { sendSMS } from "@sojipay/util/sms";
import { Session } from "@sojipay/models/Session";
import Email from "@sojipay/core/email/Email";

class UserService {
    public async createUser(firstName: string, lastName: string, email: string, phoneCode: string, phone: string, password: string) {
        let isExist = await User.findOne({where: {email: email}});

        if (isExist) {
            throw new ErrorResponse("It seems you already have an account with us.", StatusCodes.BAD_REQUEST);
        }

        const hPassword: string = await bcrypt.hash(password, 10);

        return await User.create({
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            email: email.trim(),
            phone_code: phoneCode,
            phone: trimPhone(phone),
            password: hPassword
        });
    }

    public async verifyOTP(user: User, otp: string) {
        if (user.is_verified) {
            throw new ErrorResponse("The user's account is already verified", StatusCodes.BAD_REQUEST);
        }

        const verification = await OtpVerification.findOne({ where: { user_id: user.id } });

        if (!verification) {
            throw new ErrorResponse("Please resend your OTP", StatusCodes.BAD_REQUEST);
        }

        if (verification.code != otp) {
            throw new ErrorResponse("Invalid OTP", StatusCodes.BAD_REQUEST);
        }

        await User.update({ is_verified: true }, { where: { id: user.id } });

        await OtpVerification.destroy({ where: { id: verification.id } });
    }

    public async login(email: string, password: string) {
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            throw new ErrorResponse("Invalid login credentials", StatusCodes.BAD_REQUEST);
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) throw new ErrorResponse("Invalid login credentials", StatusCodes.BAD_REQUEST);

        if (!user.is_verified) {
            const otpData = await user.generateOTP();

            sendUserOTP(user, otpData.otp);
        }

        return user;
    }

    public async generateToken(user: User) {
        const userData = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
        };

        const secret: string = process.env.TOKEN_SECRET!;
        const token = jwt.sign({ userData }, secret, { expiresIn: process.env.TOKEN_EXPIRES_IN });

        return token;
    }

    public async updateUser(user: User, data: {[key: string]: any}) {
        const values: {[key: string]: any} = {};

        if(data.firstName){
            values.first_name = data.firstName;
        }
        if(data.lastName){
            values.last_name = data.lastName;
        }
        if(data.phoneCode){
            values.phone_code = data.phoneCode;
        }
        if(data.phone){
            values.phone = trimPhone(data.phone);
        }
        
        await user.update(values);

        return user;
    }

    public async createForgotPasswordOTP(email: string) {
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            throw new ErrorResponse('No user found with the email provided', StatusCodes.BAD_REQUEST);
        }

        const otpData = await user.generateOTP(OTPTypes.FORGOT_PASSWORD);

        const message = `<h2>Hi ${user.first_name}</h2><p>You requested to change your password. Use the following code to continue: <strong>${otpData.otp}</strong></p>`;

        await Email.init().send(user.email, "Forgot Password", message);

        return otpData.id;
    }

    public async verifyForgotPasswordOTP(otpId: string, otp: string) {
        let verification = await OtpVerification.findByPk(otpId, { include: User });

        if (!verification || verification.code != otp) {
            throw new ErrorResponse("The OTP is not valid", StatusCodes.BAD_REQUEST);
        }

        return verification.user;
    }

    public async createUserPassword(otp: string, password: string, otpId: string) {
        const user = await this.verifyForgotPasswordOTP(otpId, otp);

        if (!user) {
            throw new ErrorResponse("Invalid operation", StatusCodes.UNPROCESSABLE_ENTITY);
        }

        const hPassword: string = await bcrypt.hash(password, 10);

        await User.update({ password: hPassword }, { where: { id: user.id } });

        await OtpVerification.destroy({ where: { user_id: user?.id, type: OTPTypes.FORGOT_PASSWORD } });
    }

    public async resetUserPassword(user: User, password: string): Promise<void> {
        const hPassword = await bcrypt.hash(password, 10);

        await User.update({ password: hPassword }, { where: { id: user.id } });
    }

    public async createTransactionPin(user: User, pin: string) {
        if (user.pin) throw new ErrorResponse("Transaction PIN has already been created", StatusCodes.BAD_REQUEST);

        const hPin = await bcrypt.hash(pin, 10);

        await user.update({ pin: hPin });
    }

    public async changeTransactionPin(user: User, pin: string) {
        if (!user.pin) throw new ErrorResponse("Transaction PIN has not been created", StatusCodes.BAD_REQUEST);

        const hPin = await bcrypt.hash(pin, 10);

        await user.update({ pin: hPin });

        await Session.destroy({ where: { user_id: user.id, method: SessionMethods.PIN } });
    }
}

export default UserService;