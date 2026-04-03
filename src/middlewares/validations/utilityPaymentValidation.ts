import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { formatResult } from "./formatResult";
import StatusCodes from "@sojipay/constants/enums/StatusCodes";
import ErrorResponse from "@sojipay/constants/ErrorResponse";

export const validateAirtimePurchase = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        network: Joi.string().required(),
        phone: Joi.string().required(),
        amount: Joi.number().greater(0).required(),
    });

    const result = formatResult(schema.validate(req.body));

    if (result.error) {
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}

export const validateDataPurchase = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        serviceId: Joi.string().required(),
        phone: Joi.string().required(),
        variationCode: Joi.string().required(),
        amount: Joi.number().greater(0).required(),
    });

    const result = formatResult(schema.validate(req.body));

    if (result.error) {
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}

export const validateMeterVerification = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        serviceId: Joi.string().required(),
        type: Joi.string().required(),
        meterNumber: Joi.string().required()
    });

    const result = formatResult(schema.validate(req.body));

    if (result.error) {
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}

export const validateElectricityPurchase = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        serviceId: Joi.string().required(),
        type: Joi.string().required(),
        meterNumber: Joi.string().required(),
        amount: Joi.number().greater(0).required(),
    });

    const result = formatResult(schema.validate(req.body));

    if (result.error) {
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}

export const validateSmartcardNumberVerification = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        provider: Joi.string().required(),
        smartcardNumber: Joi.string().required()
    });

    const result = formatResult(schema.validate(req.body));

    if (result.error) {
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}

export const validateTvSubscriptionPurchase = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        provider: Joi.string().required(),
        smartcardNumber: Joi.string().required(),
        variationCode: Joi.string().required(),
        amount: Joi.number().greater(0).required(),
    });

    const result = formatResult(schema.validate(req.body));

    if (result.error) {
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}

export const validateEducationProductPurchase = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        variationCode: Joi.string().required(),
        phone: Joi.string().required(),
    });

    const result = formatResult(schema.validate(req.body));

    if (result.error) {
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}