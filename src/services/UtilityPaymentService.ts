import { User } from "@sojipay/models/User";
import BigNumber from "bignumber.js";
import WalletService from "./WalletService";
import { Transaction } from "@sojipay/models/Transaction";
import { TransactionGroup, TransactionStatus, TransactionTypes } from "@sojipay/constants/enums/transactionType";
import VtpassRequests from "@sojipay/requests/vtpass/vtpassRequests";
import ErrorResponse from "@sojipay/constants/ErrorResponse";
import StatusCodes from "@sojipay/constants/enums/StatusCodes";
import { NetworkProviders } from "@sojipay/constants/enums/utilities";

class UtilityPaymentService {
    public async buyAirtime(user: User, serviceID: string, amount: number, phone: string) {

        const transactionAmount = BigNumber(amount * 100);

        await (new WalletService()).validateWalletBalance(user, transactionAmount);

        await (new WalletService()).deductWallet(user, transactionAmount);

        const transaction = await Transaction.create({
            title: 'Bought airtime',
            description: 'Bought airtime',
            type: TransactionTypes.SENT,
            group: TransactionGroup.AIRTIME,
            amount: transactionAmount.toFixed(),
            user_id: user.id,
            status: TransactionStatus.COMPLETED,
        });

        try {
            const resp = await VtpassRequests.buyAirtime(user, serviceID, amount, phone);

            if (resp.code != '000') {
                throw new ErrorResponse(resp.response_description, StatusCodes.BAD_REQUEST);
            }
        } catch (error) {
            transaction.update({ status: TransactionStatus.FAILED });
            await (new WalletService()).topupWallet(user, transactionAmount);

            throw error;
        }
    }

    public async getDataPlans(network: string) {
        let resp = await VtpassRequests.dataPlans(`${network}-data`);
        if (resp.response_description != '000') {
            throw new ErrorResponse('An error occurred', StatusCodes.BAD_REQUEST);
        }

        const data: { [key: string]: any }[] = resp.content.varations.map((item: { [key: string]: any }) => ({ ...item, service_id: resp.content.serviceID }));
        if (network == NetworkProviders.ETISALAT) {
            resp = await VtpassRequests.dataPlans(`9mobile-sme-data`);

            if (resp.response_description == '000') {
                for (let item of resp.content.varations) {
                    data.push({ ...item, service_id: resp.content.serviceID })
                }
            }
        }

        return data;
    }

    public async buyData(user: User, serviceID: string, variationCode: string, amount: number, phone: string) {

        const transactionAmount = BigNumber(amount * 100);

        await (new WalletService()).validateWalletBalance(user, transactionAmount);

        await (new WalletService()).deductWallet(user, transactionAmount);

        const transaction = await Transaction.create({
            title: 'Bought data',
            description: 'Bought data',
            type: TransactionTypes.SENT,
            group: TransactionGroup.DATA,
            amount: transactionAmount.toFixed(),
            user_id: user.id,
            status: TransactionStatus.COMPLETED,
        });

        try {
            const resp = await VtpassRequests.buyData(user, serviceID, variationCode, phone);

            if (resp.code != '000') {
                throw new ErrorResponse(resp.response_description ?? "An error occurred", StatusCodes.BAD_REQUEST);
            }
        } catch (error) {
            transaction.update({ status: TransactionStatus.FAILED });
            await (new WalletService()).topupWallet(user, transactionAmount);

            throw error;
        }
    }

    public async verifyMeter(meterNumber: string, serviceId: string, type: string) {
        const resp = await VtpassRequests.verifyMeter(meterNumber, serviceId, type);
        
        if (resp.code != '000' || resp.content.error) {
            throw new ErrorResponse(resp.response_description || resp.content.error || 'An error occurred', StatusCodes.BAD_REQUEST);
        }

        return resp.content;
    }

    public async buyElectricity(user: User, meterNumber: string, serviceId: string, type: string, amount: number) {

        const transactionAmount = BigNumber(amount * 100);

        await (new WalletService()).validateWalletBalance(user, transactionAmount);

        await (new WalletService()).deductWallet(user, transactionAmount);

        const transaction = await Transaction.create({
            title: 'Bought Electricity',
            description: 'Bought Electricity',
            type: TransactionTypes.SENT,
            group: TransactionGroup.ELECTRICITY,
            amount: transactionAmount.toFixed(),
            user_id: user.id,
            status: TransactionStatus.COMPLETED,
        });

        try {
            const resp = await VtpassRequests.buyElectricity(user, meterNumber, serviceId, type, amount);

            if (resp.code != '000') {
                throw new ErrorResponse(resp.response_description ?? "An error occurred", StatusCodes.BAD_REQUEST);
            }
            
            return resp;
        } catch (error) {
            transaction.update({ status: TransactionStatus.FAILED });
            await (new WalletService()).topupWallet(user, transactionAmount);

            throw error;
        }
    }

    public async getTvPlans(provider: string) {
        let resp = await VtpassRequests.tvSubscriptionPlans(provider);
        if (resp.response_description != '000') {
            throw new ErrorResponse('An error occurred', StatusCodes.BAD_REQUEST);
        }

        return resp.content.varations;
    }

    public async getEducationProducts() {
        let resp = await VtpassRequests.waecVariationCodes();

        if (resp.response_description != '000') {
            throw new ErrorResponse('An error occurred', StatusCodes.BAD_REQUEST);
        }

        return resp.content.varations;
    }

    public async verifySmartcardNumber(smartcardNumber: string, provider: string) {
        const resp = await VtpassRequests.verifySmartcardNumber(smartcardNumber, provider);
        
        if (resp.code != '000' || resp.content.error) {
            throw new ErrorResponse(resp.response_description || resp.content.error || 'An error occurred', StatusCodes.BAD_REQUEST);
        }

        return resp.content;
    }

    public async buyTvSubscription(user: User, smartcardNumber: string, provider: string, variationCode: string, amount: number) {

        const transactionAmount = BigNumber(amount * 100);

        await (new WalletService()).validateWalletBalance(user, transactionAmount);

        await (new WalletService()).deductWallet(user, transactionAmount);

        const transaction = await Transaction.create({
            title: 'Bought Tv Sub',
            description: 'Bought Tv Sub',
            type: TransactionTypes.SENT,
            group: TransactionGroup.TV,
            amount: transactionAmount.toFixed(),
            user_id: user.id,
            status: TransactionStatus.COMPLETED,
        });

        try {
            const resp = await VtpassRequests.buyTvSubscription(user, smartcardNumber, provider, variationCode, amount);

            if (resp.code != '000') {
                throw new ErrorResponse(resp.response_description ?? "An error occurred", StatusCodes.BAD_REQUEST);
            }
            
            return resp;
        } catch (error) {
            transaction.update({ status: TransactionStatus.FAILED });
            await (new WalletService()).topupWallet(user, transactionAmount);

            throw error;
        }
    }

    public async buyEducationProduct(user: User, variationCode: string, phone: string) {
        const data = await this.getEducationProducts();
        
        const transactionAmount = BigNumber(Number(`${data[0].variation_amount}`) * 100);

        await (new WalletService()).validateWalletBalance(user, transactionAmount);

        await (new WalletService()).deductWallet(user, transactionAmount);

        const transaction = await Transaction.create({
            title: 'Bought WAEC Result Checker Pin',
            description: 'Bought WAEC Result Checker Pin',
            type: TransactionTypes.SENT,
            group: TransactionGroup.EDUCATION,
            amount: transactionAmount.toFixed(),
            user_id: user.id,
            status: TransactionStatus.COMPLETED,
        });

        try {
            const resp = await VtpassRequests.buyWaecPin(user, variationCode, phone);

            if (resp.code != '000') {
                throw new ErrorResponse(resp.response_description ?? "An error occurred", StatusCodes.BAD_REQUEST);
            }
            
            return resp.cards[0];
        } catch (error) {
            transaction.update({ status: TransactionStatus.FAILED });
            await (new WalletService()).topupWallet(user, transactionAmount);

            throw error;
        }
    }
}

export default UtilityPaymentService;