import ErrorResponse from "@sojipay/constants/ErrorResponse";
import { EventTypes } from "@sojipay/constants/enums/Events";
import StatusCodes from "@sojipay/constants/enums/StatusCodes";
import { SessionMethods } from "@sojipay/constants/enums/User";
import { AuthRequest } from "@sojipay/constants/interfaces/AuthRequest";
import { unverifiedUserAuth, userAuth } from "@sojipay/middlewares/authentication";
import { validateAccountVerification, validateBiometricsLogin, validateChangePINRequest, validateCreatePINRequest, validateCreateUserRequest, validateForgotPasswordOTPRequest, validateForgotPasswordRequest, validateIdentityVerificationRequest, validateLoginRequest, validateResetPasswordRequest, validateUpdateUserRequest } from "@sojipay/middlewares/validations/userValidations";
import SessionService from "@sojipay/services/SessionService";
import UserService from "@sojipay/services/UserService";
import appEvents from "@sojipay/services/events";
import { buildV1AppPath, sendUserOTP } from "@sojipay/util/helpers";
import { NextFunction, Request, Response } from "express";
import { BaseController, controller, middlewares, route } from "express-ts-annotations";

@controller(buildV1AppPath('users'))
class UserController extends BaseController {
    @route('post', '/')
    @middlewares([validateCreateUserRequest])
    public async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userService = new UserService();

            const user = await userService.createUser(req.body.firstName, req.body.lastName, req.body.email, req.body.phoneCode, req.body.phone, req.body.password);

            appEvents.emit(EventTypes.USER_CREATED, user);

            const token = await userService.generateToken(user);

            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: "You have successfully created an account",
                data: {
                    user: user.getDetails(),
                    token: token,
                }
            });
        } catch (error) {
            next(error);
        }
    }

    @route('post', '/otp')
    @middlewares([unverifiedUserAuth])
    public async resendOTP(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const user = req.user!;
            if (user.is_verified) {
                throw new ErrorResponse("User's account is already verified", StatusCodes.BAD_REQUEST);
            }

            const otpData = await user.generateOTP();

            sendUserOTP(user, otpData.otp);

            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: "Your OTP has been sent!",
            });
        } catch (error) {
            next(error);
        }
    }

    @route('post', '/otp-verifications')
    @middlewares([validateAccountVerification, unverifiedUserAuth])
    public async verifyAccount(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const user = req.user!;

            await (new UserService()).verifyOTP(user, req.body.otp);

            appEvents.emit(EventTypes.USER_VERIFIED, user);

            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: "Your account has been verified",
            });
        } catch (error) {
            next(error)
        }
    }

    @route('post', '/tokens')
    @middlewares([validateLoginRequest])
    public async userLogin(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await (new UserService()).login(req.body.email, req.body.password);

            const token = await (new UserService()).generateToken(user);

            appEvents.emit(EventTypes.USER_LOGGED_IN, user);

            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: "You have successfully logged in",
                data: {
                    user: user.getDetails(),
                    token: token
                },
            });
        } catch (error) {
            next(error);
        }
    }

    @route('post', '/tokens/biometrics')
    @middlewares([validateBiometricsLogin])
    public async userBiometricsLogin(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await (new SessionService()).validateBiometricSession(req.body.sessionId, req.body.deviceId);

            const token = await (new UserService()).generateToken(user);

            appEvents.emit(EventTypes.USER_LOGGED_IN, user);

            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: "You have successfully logged in",
                data: {
                    user: user.getDetails(),
                    token: token
                }
            });
        } catch (error) {
            next(error);
        }
    }
    
    @route('get', '/me')
    @middlewares([userAuth])
    public async getUserDetails(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            return res.json({
                success: true,
                data: req.user?.getDetails()
            });
        } catch (error) {
            next(error);
        }
    }

    @route('patch', '/me')
    @middlewares([userAuth, validateUpdateUserRequest])
    public async updateUserDetails(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const user = await(new UserService()).updateUser(req.user!, req.body);

            return res.json({
                success: true,
                message: 'Operation successful',
                data: user.getDetails()
            });
        } catch (error) {
            next(error);
        }
    }

    @route('post', '/forgot-password-otp')
    @middlewares([validateForgotPasswordOTPRequest])
    public async createForgotPasswordOTP(req: Request, res: Response, next: NextFunction) {
        try {
            const otpId = await (new UserService()).createForgotPasswordOTP(req.body.email);

            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: 'OTP sent!',
                data: { otp_id: otpId }
            });
        } catch (error) {
            next(error);
        }
    }

    @route('get', '/forgot-password-otp/:otpId')
    public async verifyForgotPasswordOTP(req: Request, res: Response, next: NextFunction) {
        try {
            const { otp } = req.query as { otp: string };
            const { otpId } = req.params;

            await (new UserService()).verifyForgotPasswordOTP(otpId, otp);

            return res.json({
                success: true,
                message: 'OTP is valid!',
            });
        } catch (error) {
            next(error);
        }
    }

    @route('post', '/password')
    @middlewares([validateForgotPasswordRequest])
    public async createUserPassword(req: Request, res: Response, next: NextFunction) {
        try {
            await (new UserService()).createUserPassword(req.body.otp, req.body.password, req.body.otpId);

            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: 'You have successfully reset your password',
            });
        } catch (error) {
            next(error)
        }
    }

    @route('patch', '/password')
    @middlewares([userAuth,validateResetPasswordRequest])
    public async resetUserPassword(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await (new SessionService()).validateSession(req.body.sessionId, SessionMethods.PASSWORD, req.user!);

            await (new UserService()).resetUserPassword(req.user!, req.body.password);

            await (new SessionService()).delete(req.body.sessionId, req.user!);
            
            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: 'You have successfully reset your password',
            });
        } catch (error) {
            next(error)
        }
    }

    @route('post', '/transaction-pin')
    @middlewares([validateCreatePINRequest, userAuth])
    public async createTransactionPin(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await (new UserService()).createTransactionPin(req.user!, req.body.pin);

            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: 'You have sucessfully created your PIN',
            });
        } catch (error) {
            next(error);
        }
    }

    @route('put', '/transaction-pin')
    @middlewares([validateChangePINRequest, userAuth])
    public async changeTransactionPin(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await (new SessionService()).validateSession(req.body.sessionId, SessionMethods.PIN, req.user!);

            await (new UserService()).changeTransactionPin(req.user!, req.body.pin);

            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: 'You have sucessfully changed your PIN',
            });
        } catch (error) {
            next(error);
        }
    }

    public static createInstance(): UserController {
        return new UserController();
    }
}

export default UserController;