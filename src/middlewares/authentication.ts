import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthType } from '@sojipay/constants/types/AuthType';
import { User } from '@sojipay/models/User';
import ErrorResponse from '@sojipay/constants/ErrorResponse';
import StatusCodes from '@sojipay/constants/enums/StatusCodes';
import { AuthRequest } from '@sojipay/constants/interfaces/AuthRequest';


export const unverifiedUserAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {

    try {
        const token = req.headers.authorization?.split(" ")[1];
        
        if (!token) {
            next(new ErrorResponse("Unauthorized", StatusCodes.UNAUTHORIZED));
        } else {
            const secret: string = process.env.TOKEN_SECRET!;

            const decoded: AuthType = jwt.verify(token, secret) as AuthType;
            
            if (decoded) {
                const user = await User.findOne({where: {id: decoded.userData.id}});

                req.user = user!;

                next();
            }else{
                next(new ErrorResponse("Unauthorized", StatusCodes.UNAUTHORIZED));
            }
        }
    } catch (error) {
        next(new ErrorResponse("Unauthorized", StatusCodes.UNAUTHORIZED))
    }
}   

export const userAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {

    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            next(new ErrorResponse("Unauthorized", StatusCodes.UNAUTHORIZED));
        } else {
            const secret: string = process.env.TOKEN_SECRET!;
            const decoded: AuthType = jwt.verify(token, secret) as AuthType;
            
            if (decoded) {
                const user = await User.findOne({where: {id: decoded.userData.id}});

                if(!user?.is_verified){
                    next(new ErrorResponse("Unverified user", StatusCodes.FORBIDDEN));
                    return;
                }

                req.user = user;

                next();
            }else{
                next(new ErrorResponse("Unauthorized", StatusCodes.UNAUTHORIZED));
            }
        }
    } catch (error) {
        next(new ErrorResponse("Unauthorized", StatusCodes.UNAUTHORIZED))
    }
}