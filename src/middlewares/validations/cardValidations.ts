import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { formatResult } from "./formatResult";
import ErrorResponse from "@sojipay/constants/ErrorResponse";
import StatusCodes from "@sojipay/constants/enums/StatusCodes";

export const validateCardCreationRequest = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        cardName: Joi.string().required(),
        brand: Joi.string().required(),
        topUpAmount: Joi.number().min(3).required(),
        bvn: Joi.optional(),
        idNumber: Joi.optional(),
    });

    const result = formatResult(schema.validate(req.body));

    if (result.error) {
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}

export const validateFundCardRequest = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        amount: Joi.number().min(1).required(),
    });

    const result = formatResult(schema.validate(req.body));

    if (result.error) {
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}

export const validateCardWithdrawalRequest = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        amount: Joi.number().greater(0).required(),
    });

    const result = formatResult(schema.validate(req.body));

    if (result.error) {
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}