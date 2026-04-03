import { NextFunction, Request, Response } from "express";
import ErrorResonse from "@sojipay/constants/ErrorResponse";
import StatusCodes from "@sojipay/constants/enums/StatusCodes";

export const errorHandler = (error: ErrorResonse, req: Request, res: Response, next: NextFunction) => {
    // console.log(error);
    return res.status(error.statusCode || StatusCodes.SERVER_ERROR).json({
        success: false,
        error: {
            message: error.message || 'Server error',
        }
    });
}