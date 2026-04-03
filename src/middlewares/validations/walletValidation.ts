import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { formatResult } from "./formatResult";
import ErrorResponse from "@sojipay/constants/ErrorResponse";
import StatusCodes from "@sojipay/constants/enums/StatusCodes";

export const validateSaleGiftcard = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        giftcard: Joi.string().required(),
        number: Joi.string().required(),
        pin: Joi.string().required(),
        value: Joi.number().greater(0).required(),
    });

    const result = formatResult(schema.validate(req.body));

    if (result.error) {
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}