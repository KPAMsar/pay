import { Card } from "@sojipay/models/Card";
import { User } from "@sojipay/models/User";
import ErrorResponse from "@sojipay/constants/ErrorResponse";
import StatusCodes from "@sojipay/constants/enums/StatusCodes";
import { CardFee } from "@sojipay/models/CardFee";
import { LocalCurrency } from "@sojipay/models/LocalCurrency";
import { Transaction } from "@sojipay/models/Transaction";
import { TransactionGroup, TransactionStatus, TransactionTypes } from "@sojipay/constants/enums/transactionType";
import WalletService from "@sojipay/services/WalletService";
import BigNumber from "bignumber.js";
import CardFactory from "@sojipay/core/cards/CardFactory";

class CardService {
    public async getDbCard(cardId: string) {
        const card = await Card.findByPk(cardId, { include: User });
        if (!card) {
            throw new ErrorResponse("The card id is not valid", StatusCodes.BAD_REQUEST);
        }

        return card;
    }

    public async getUserCard(user: User) {
        const card = await Card.findOne({where: {user_id: user.id, is_deleted: false}, include: User });
        if (!card) {
            throw new ErrorResponse("No card found", StatusCodes.BAD_REQUEST);
        }

        return card;
    }
    
    public async withdrawFromCard(user: User, amount: number) {
        const card = await this.getUserCard(user);

        const localCurrency = await LocalCurrency.findOne();
        if(!localCurrency){
            throw new ErrorResponse("Set up local currency", StatusCodes.BAD_REQUEST);
        }

        const transactionAmount = BigNumber(amount).multipliedBy(localCurrency.selling_rate);

        const walletService = new WalletService();

        await walletService.validateWalletBalance(user, transactionAmount);

        await walletService.deductWallet(user, transactionAmount);

        await CardFactory.forCard(card).withdraw(card, amount);

        await Transaction.create({
            title: 'Card withdrawal',
            description: 'Card withdrawal',
            type: TransactionTypes.RECEIVED,
            group: TransactionGroup.CARD,
            amount: transactionAmount.toFixed(),
            user_id: user.id,
            status: TransactionStatus.COMPLETED,
        });
    }

    public async fundCard(user: User, amount: number) {
        const card = await this.getUserCard(user);

        const cardFees = await CardFee.findOne();
        const calcFee = ((((cardFees?.topup_fee ?? 0) / 100) * amount)).toFixed(2);
        const transactionFee = Math.min(Number(calcFee), Number(`${cardFees?.topup_fee_cap}`));

        const localCurrency = await LocalCurrency.findOne({ where: { currency_code: 'NGN' } });
        if (!localCurrency) {
            throw new ErrorResponse("Local currency not found", StatusCodes.BAD_REQUEST);
        }

        let paymentAmount = Math.ceil(((localCurrency.conversion_rate * (amount + transactionFee))));
        
        const transactionAmount = BigNumber(paymentAmount);

        const walletService = new WalletService();

        await walletService.validateWalletBalance(user, transactionAmount);

        await walletService.deductWallet(user, transactionAmount);

        const transaction = await Transaction.create({
            title: 'Card top up',
            description: 'Card top up',
            type: TransactionTypes.SENT,
            group: TransactionGroup.CARD,
            amount: transactionAmount.toFixed(),
            user_id: user.id,
            status: TransactionStatus.COMPLETED,
        });

        try {
            await CardFactory.forCard(card).fundCard(card, amount);
        } catch (error) {
            transaction.update({ status: TransactionStatus.FAILED });
            await (new WalletService()).topupWallet(user, transactionAmount);

            throw error;
        }
    }

    public async getCardFees(currency: string = 'USD') {
        const fees = await CardFee.findOne({ where: { currency: currency }, attributes: { exclude: ['created_at', 'updated_at', 'id'] } });

        return fees;
    }

    public async getCardTransactions(cardId: string, page: number) {
    }
}

export default CardService;