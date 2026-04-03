import { NextFunction, Request, Response } from "express";
import { BaseController, controller, middlewares, route } from "express-ts-annotations";
import { AuthRequest } from "@sojipay/constants/interfaces/AuthRequest";
import { SessionMethods } from "@sojipay/constants/enums/User";
import SessionService from "@sojipay/services/SessionService";
import ErrorResponse from "@sojipay/constants/ErrorResponse";
import StatusCodes from "@sojipay/constants/enums/StatusCodes";
import { userAuth } from "@sojipay/middlewares/authentication";
import { buildV1AppPath } from "@sojipay/util/helpers";

@controller(buildV1AppPath('sessions'))
class SessionController extends BaseController{

    @route('post', '/')
    @middlewares([userAuth])
    public async createSession(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!(<any>Object).values(SessionMethods).includes(req.body.method)) {
                throw new ErrorResponse(`Invalid session method, method must be one of the following ${(<any>Object).values(SessionMethods)}`, StatusCodes.BAD_REQUEST);
            }
        
            let session;
            if(req.body.method === SessionMethods.PASSWORD){
                if(!req.body.value){
                    throw new ErrorResponse("value is required", StatusCodes.BAD_REQUEST);
                }

                session = await (new SessionService()).createPasswordSession(req.user!, req.body.value);
            }else if(req.body.method === SessionMethods.PIN){
                if(!req.body.value){
                    throw new ErrorResponse("value is required", StatusCodes.BAD_REQUEST);
                }

                session = await (new SessionService()).createPINSession(req.user!, req.body.value);
            }else if(req.body.method === SessionMethods.BIOMETRICS) {
                if(!req.body.deviceId){
                    throw new ErrorResponse("Device is required", StatusCodes.BAD_REQUEST);
                }

                session = await(new SessionService()).createBiometricSession(req.user!, req.body.deviceId);
            }
        
            return res.json({
                success: true,
                data: {
                    sessionId: session?.id
                }
            });
        } catch (error) {
            next(error)
        }
    }

    @route('delete', '/:sessionId')
    @middlewares([userAuth])
    public async deleteSession(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await (new SessionService()).delete(req.params.sessionId, req.user!);

            return res.json({
                success: true,
                message: "Operation successful",
            });
        } catch (error) {
            next(error);
        }
    }

    public static createInstance(): SessionController {
        return new SessionController();
    }
}

export default SessionController;