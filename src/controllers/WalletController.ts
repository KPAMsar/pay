import { AuthRequest } from "@sojipay/constants/interfaces/AuthRequest";
import { userAuth } from "@sojipay/middlewares/authentication";
import WalletService from "@sojipay/services/WalletService";
import { buildV1AppPath } from "@sojipay/util/helpers";
import { Response } from "express";
import { NextFunction } from "express-serve-static-core";
import { BaseController, controller, middlewares, route } from "express-ts-annotations";

@controller(buildV1AppPath('wallet'))
class WalletController extends BaseController {
    @route('get', '/')
    @middlewares([userAuth])
    public async getWallet(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const data = await (new WalletService()).getUserWallet(req.user!);

            return res.json({
                success: true,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    }

    public static createInstance(): WalletController{
        return new WalletController();
    }
}

export default WalletController;