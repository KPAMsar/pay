import { EventTypes } from "@sojipay/constants/enums/Events";
import StatusCodes from "@sojipay/constants/enums/StatusCodes";
import { AuthRequest } from "@sojipay/constants/interfaces/AuthRequest";
import CardFactory from "@sojipay/core/cards/CardFactory";
import { userAuth } from "@sojipay/middlewares/authentication";
import { validateCardWithdrawalRequest, validateFundCardRequest } from "@sojipay/middlewares/validations/cardValidations";
import CardService from "@sojipay/services/CardService";
import appEvents from "@sojipay/services/events";
import { buildV1AppPath } from "@sojipay/util/helpers";
import { NextFunction, Response } from "express";
import { BaseController, controller, middlewares, route } from "express-ts-annotations";

@controller(buildV1AppPath('card'))
class CardController extends BaseController {
    @route('post', '/')
    @middlewares([userAuth])
    public async createCard(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const card = await CardFactory.init().createCard(req.user!);

            appEvents.emit(EventTypes.CARD_CREATED, req.user, card);

            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: "Operation successful",
            });
        } catch (error) {
            next(error);
        }
    }

    @route('get', '/')
    @middlewares([userAuth])
    public async userCard(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const card = await (new CardService()).getUserCard(req.user!);

            const data = await CardFactory.forCard(card).getCard(card);

            return res.json({
                success: true,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    }

    @route('patch', '/freeze')
    @middlewares([userAuth])
    public async freezeCard(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const card = await (new CardService()).getUserCard(req.user!);

            await CardFactory.forCard(card).freezeCard(card);

            return res.json({
                success: true,
                message: "Operation successful",
            });
        } catch (error) {
            next(error);
        }
    }

    @route('patch', '/unfreeze')
    @middlewares([userAuth])
    public async unfreezeCard(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const card = await (new CardService()).getUserCard(req.user!);

            await CardFactory.forCard(card).unfreezeCard(card);

            return res.json({
                success: true,
                message: "Operation successful",
            });
        } catch (error) {
            next(error);
        }
    }

    @route('post', '/fund')
    @middlewares([userAuth, validateFundCardRequest])
    public async fundCard(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await (new CardService()).fundCard(req.user!, req.body.amount);

            return res.json({
                success: true,
                message: 'Operation successful'
            });
        } catch (error) {
            next(error);
        }
    }

    @route('post', '/withdrawals')
    @middlewares([userAuth, validateCardWithdrawalRequest])
    public async withdrawalFundsFromCard(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await (new CardService()).withdrawFromCard(req.user!, req.body.amount);

            return res.json({
                success: true,
                message: "Operation successful",
            });
        } catch (error) {
            next(error);
        }
    }

    @route('delete', '/')
    @middlewares([userAuth])
    public async deleteCard(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const card = await (new CardService()).getUserCard(req.user!);

            await CardFactory.forCard(card).delete(card);

            return res.json({
                success: true,
                message: "Operation successful",
            });
        } catch (error) {
            next(error);
        }
    }

    @route('get', '/transactions')
    @middlewares([userAuth])
    public async cardTransactions(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const page: number = parseInt(req.query.page as unknown as string) || 1;

            const card = await (new CardService()).getUserCard(req.user!);
            const data = await CardFactory.forCard(card).transactions(card, page);

            return res.json({
                success: true,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    }

    @route('get', '/fees')
    @middlewares([userAuth])
    public async getCardFees(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const data = await (new CardService()).getCardFees();

            return res.json({
                success: true,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    }


    public static createInstance(): CardController {
        return new CardController();
    }
}

export default CardController;