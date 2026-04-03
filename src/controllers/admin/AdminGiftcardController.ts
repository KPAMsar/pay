import ErrorResponse from "@sojipay/constants/ErrorResponse";
import StatusCodes from "@sojipay/constants/enums/StatusCodes";
import GiftcardService from "@sojipay/services/GiftcardService";
import { buildV1AppPath } from "@sojipay/util/helpers";
import { NextFunction, Request, Response } from "express";
import { BaseController, controller, route } from "express-ts-annotations";

@controller(buildV1AppPath('admin/giftcards'))
class AdminGiftcardController extends BaseController {
    @route('get', '/')
    public async getGiftcards(req: Request, res: Response, next: NextFunction) {
        try {
            const page: number = parseInt(req.query.page as unknown as string) || 1;

            const { data, metadata } = await (new GiftcardService()).adminGetGiftcards(page);

            return res.json({
                success: true,
                data: data,
                metadata: metadata,
            });
        } catch (error) {
            next(error);
        }
    }

    @route('get', '/pending')
    public async getPendingGiftcards(req: Request, res: Response, next: NextFunction) {
        try {
            const page: number = parseInt(req.query.page as unknown as string) || 1;

            const { data, metadata } = await (new GiftcardService()).adminGetPendingGiftcards(page);

            return res.json({
                success: true,
                data: data,
                metadata: metadata,
            });
        } catch (error) {
            next(error);
        }
    }

    @route('get', '/:giftcardId')
    public async getGiftcardDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await (new GiftcardService()).AdminGetGiftcard(req.params.giftcardId);

            return res.json({
                success: true,
                data: data,
            })
        } catch (error) {
            next(error);
        }
    }

    @route('patch', '/:giftcardId')
    public async processGiftcard(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.body.status != 'valid' && req.body.status != 'used') {
                throw new ErrorResponse("status must either be valid or used", StatusCodes.BAD_REQUEST);
            }

            await (new GiftcardService()).processGiftcard(req.params.giftcardId, req.body.status);

            return res.json({
                success: true,
                message: 'Operation successful',
            });
        } catch (error) {
            next(error);
        }
    }

    public static createInstance(): AdminGiftcardController {
        return new AdminGiftcardController();
    }
}

export default AdminGiftcardController;