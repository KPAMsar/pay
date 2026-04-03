import { AuthRequest } from "@sojipay/constants/interfaces/AuthRequest";
import { userAuth } from "@sojipay/middlewares/authentication";
import GiftcardService from "@sojipay/services/GiftcardService";
import { buildV1AppPath } from "@sojipay/util/helpers";
import multer from '@sojipay/middlewares/multer';
import { NextFunction, Response } from "express";
import { BaseController, controller, middlewares, route } from "express-ts-annotations";
import { validateSaleGiftcard } from "@sojipay/middlewares/validations/walletValidation";
import cloudinary from "@sojipay/util/cloudinary";
import StatusCodes from "@sojipay/constants/enums/StatusCodes";

@controller(buildV1AppPath('giftcards'))
class GiftcardController extends BaseController {

    @route("get", "/")
    @middlewares([userAuth])
    public async getGiftcards(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const giftcards = await (new GiftcardService()).getAll();

            return res.json({
                success: true,
                data: giftcards
            });
        } catch (error) {
            next(error);
        }
    }

    @route("post", "/sales")
    @middlewares([userAuth, multer.single('cardImage'), validateSaleGiftcard])
    public async sellGiftcard(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await cloudinary.uploader.upload(req.file!.path);

            await (new GiftcardService()).sellGiftcard(req.user!, req.body.giftcard, req.body.number, req.body.pin, req.body.value, result.secure_url);

            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: "Operation successful",
            });
        } catch (error) {
            next(error);
        }
    }


    public static createInstance(): GiftcardController {
        return new GiftcardController();
    }
}

export default GiftcardController;