import ErrorResponse from "@sojipay/constants/ErrorResponse";
import StatusCodes from "@sojipay/constants/enums/StatusCodes";
import { ElectricityServiceId, ElectricityTypes, NetworkProviders, TvServiceId } from "@sojipay/constants/enums/utilities";
import { AuthRequest } from "@sojipay/constants/interfaces/AuthRequest";
import { userAuth } from "@sojipay/middlewares/authentication";
import { validateAirtimePurchase, validateDataPurchase, validateEducationProductPurchase, validateElectricityPurchase, validateMeterVerification, validateSmartcardNumberVerification, validateTvSubscriptionPurchase } from "@sojipay/middlewares/validations/utilityPaymentValidation";
import UtilityPaymentService from "@sojipay/services/UtilityPaymentService";
import { buildV1AppPath } from "@sojipay/util/helpers";
import { NextFunction, Response } from "express";
import { BaseController, controller, middlewares, route } from "express-ts-annotations";

@controller(buildV1AppPath('utility-payments'))
class UtilityPaymentsController extends BaseController {
    @route('post', '/airtime')
    @middlewares([userAuth, validateAirtimePurchase])
    public async buyAirtime(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!(<any>Object).values(NetworkProviders).includes(req.body.network)) {
                throw new ErrorResponse(`Invalid network, network must be one of the following ${(<any>Object).values(NetworkProviders)}`, StatusCodes.BAD_REQUEST);
            }

            await (new UtilityPaymentService()).buyAirtime(req.user!, req.body.network, req.body.amount, req.body.phone);

            return res.json({
                success: true,
                message: 'Airtime purhcase successful',
            });
        } catch (error) {
            next(error);
        }
    }

    @route('get', '/data/plans')
    @middlewares([userAuth])
    public async dataPlans(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const network = req.query.network as unknown as string;

            if (!(<any>Object).values(NetworkProviders).includes(network)) {
                throw new ErrorResponse(`Invalid network, network must be one of the following ${(<any>Object).values(NetworkProviders)}`, StatusCodes.BAD_REQUEST);
            }

            const data = await (new UtilityPaymentService()).getDataPlans(network);

            return res.json({
                success: true,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    }

    @route('post', '/data')
    @middlewares([userAuth, validateDataPurchase])
    public async buyData(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await (new UtilityPaymentService()).buyData(req.user!, req.body.serviceId, req.body.variationCode, req.body.amount, req.body.phone);

            return res.json({
                success: true,
                message: 'Data purhcase successful',
            });
        } catch (error) {
            next(error);
        }
    }

    @route('post', '/electricity/verify-meter')
    @middlewares([userAuth, validateMeterVerification])
    public async verifyMeter(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!(<any>Object).values(ElectricityServiceId).includes(req.body.serviceId)) {
                throw new ErrorResponse(`Invalid Service id, Service id must be one of the following ${(<any>Object).values(ElectricityServiceId)}`, StatusCodes.BAD_REQUEST);
            }

            if (!(<any>Object).values(ElectricityTypes).includes(req.body.type)) {
                throw new ErrorResponse(`Invalid type, type must be one of the following ${(<any>Object).values(ElectricityTypes)}`, StatusCodes.BAD_REQUEST);
            }

            const data = await (new UtilityPaymentService()).verifyMeter(req.body.meterNumber, req.body.serviceId, req.body.type);

            return res.json({
                success: true,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    }


    @route('post', '/electricity')
    @middlewares([userAuth, validateElectricityPurchase])
    public async buyElectricity(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!(<any>Object).values(ElectricityServiceId).includes(req.body.serviceId)) {
                throw new ErrorResponse(`Invalid Service id, Service id must be one of the following ${(<any>Object).values(ElectricityServiceId)}`, StatusCodes.BAD_REQUEST);
            }

            if (!(<any>Object).values(ElectricityTypes).includes(req.body.type)) {
                throw new ErrorResponse(`Invalid type, type must be one of the following ${(<any>Object).values(ElectricityTypes)}`, StatusCodes.BAD_REQUEST);
            }

            const data = await (new UtilityPaymentService()).buyElectricity(req.user!, req.body.meterNumber, req.body.serviceId, req.body.type, req.body.amount);

            return res.json({
                success: true,
                message: 'Electricity token purchased successfully',
                data: data,
            });
        } catch (error) {
            next(error);
        }
    }

    @route('get', '/tv/plans')
    @middlewares([userAuth])
    public async tvPlans(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const provider = req.query.provider as unknown as string;

            if (!(<any>Object).values(TvServiceId).includes(provider)) {
                throw new ErrorResponse(`Invalid provider, provider must be one of the following ${(<any>Object).values(TvServiceId)}`, StatusCodes.BAD_REQUEST);
            }

            const data = await (new UtilityPaymentService()).getTvPlans(provider);

            return res.json({
                success: true,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    }

    @route('post', '/tv/verify-smartcard')
    @middlewares([userAuth, validateSmartcardNumberVerification])
    public async verifySmartcardNumber(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!(<any>Object).values(TvServiceId).includes(req.body.provider)) {
                throw new ErrorResponse(`Invalid provider, provider must be one of the following ${(<any>Object).values(TvServiceId)}`, StatusCodes.BAD_REQUEST);
            }

            const data = await (new UtilityPaymentService()).verifySmartcardNumber(req.body.smartcardNumber, req.body.provider);

            return res.json({
                success: true,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    }

    @route('post', '/tv')
    @middlewares([userAuth, validateTvSubscriptionPurchase])
    public async buyTvSubscription(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!(<any>Object).values(TvServiceId).includes(req.body.provider)) {
                throw new ErrorResponse(`Invalid provider, provider must be one of the following ${(<any>Object).values(TvServiceId)}`, StatusCodes.BAD_REQUEST);
            }

            const data = await (new UtilityPaymentService()).buyTvSubscription(req.user!, req.body.smartcardNumber, req.body.provider, req.body.variationCode, req.body.amount);

            return res.json({
                success: true,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    }

    @route('get', '/education/products')
    @middlewares([userAuth])
    public async educationProducts(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const data = await (new UtilityPaymentService()).getEducationProducts();

            return res.json({
                success: true,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    }

    @route('post', '/education')
    @middlewares([userAuth, validateEducationProductPurchase])
    public async buyEducationProduct(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const data = await (new UtilityPaymentService()).buyEducationProduct(req.user!, req.body.variationCode, req.body.phone);

            return res.json({
                success: true,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    }


    public static createInstance(): UtilityPaymentsController {
        return new UtilityPaymentsController();
    }
}

export default UtilityPaymentsController;