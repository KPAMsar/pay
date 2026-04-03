import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { formatResult } from "@sojipay/middlewares/validations/formatResult";
import ErrorResponse from "@sojipay/constants/ErrorResponse";
import StatusCodes from "@sojipay/constants/enums/StatusCodes";

const JoiObj: typeof Joi & { objectId?: any } = Joi;

JoiObj.objectId = require('joi-objectid')(Joi)

export const validateCreateUserRequest = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        phoneCode: Joi.string().min(3).max(4).required(),
        phone: Joi.string().min(10).max(11).required(),
        password: Joi.string().min(8).required(),
    });

    const result = formatResult(schema.validate(req.body));

    if (result.error) {
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}

export const validateAccountVerification = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        otp: Joi.string().length(4).required()
    });

    const result = formatResult(schema.validate(req.body));

    if (result.error) {
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}

export const validateForgotPasswordOTPRequest = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
    });

    const result = formatResult(schema.validate(req.body));

    if (result.error) {
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}

export const validateForgotPasswordOTPVerification = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().length(4).required()
    });

    const result = formatResult(schema.validate(req.query));

    if (result.error) {
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}

export const validatePasswordResetRequest = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        otp: Joi.string().length(4).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required()
    });

    const result = formatResult(schema.validate(req.body));

    if (result.error) {
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}

export const validateLoginRequest = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
    });

    const result = formatResult(schema.validate(req.body));

    if (result.error) {
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}

export const validateBiometricsLogin = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        sessionId: Joi.string().required(),
        deviceId: Joi.string().required(),
    });
    
    const result = formatResult(schema.validate(req.body));

    if(result.error){
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}

export const validateChangePasswordRequest = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        oldPassword: Joi.string().required(),
        password: Joi.string().min(8).required()
    });

    const result = formatResult(schema.validate(req.body));

    if (result.error) {
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}

export const validateForgotPasswordRequest = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        otp: Joi.string().length(4).required(),
        otpId: Joi.string().required(),
        password: Joi.string().required()
    });

    const result = formatResult(schema.validate(req.body));

    if (result.error) {
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}

export const validateResetPasswordRequest = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        sessionId: Joi.string().required(),
        password: Joi.string().required(),
    });

    const result = formatResult(schema.validate(req.body));

    if (result.error) {
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}

export const validateUpdateUserRequest = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        firstName: Joi.string().optional(),
        lastName: Joi.string().optional(),
        phoneCode: Joi.string().min(3).max(4).optional(),
        phone: Joi.string().min(10).max(11).optional(),
        email: Joi.string().email().optional(),
        gender: Joi.string().optional(),
        dob: Joi.date().optional(),
        maritalStatus: Joi.string().optional(),
        address: Joi.string().optional(),
        lga: Joi.string().optional(),
        state: Joi.string().optional(),
        residentialStatus: Joi.string().optional(),
        whenMovedIn: Joi.date().optional(),
        avatar: Joi.string().optional()
    });

    const result = formatResult(schema.validate(req.body));

    if (result.error) {
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}

export const validateIdentityVerificationRequest = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        method: Joi.string().required(),
        number: Joi.string().required(),
    });

    const result = formatResult(schema.validate(req.body));

    if (result.error) {
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}

export const validateCreatePINRequest = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        pin: Joi.string().length(4).required()
    });
    
    const result = formatResult(schema.validate(req.body));
    
    if(result.error){
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}

export const validateChangePINRequest = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        pin: Joi.string().length(4).required(),
        sessionId: Joi.string().required(),
    });
    
    const result = formatResult(schema.validate(req.body));
    
    if(result.error){
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}