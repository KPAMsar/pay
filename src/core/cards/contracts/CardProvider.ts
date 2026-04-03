import ErrorResponse from "@sojipay/constants/ErrorResponse";
import StatusCodes from "@sojipay/constants/enums/StatusCodes";
import { Card } from "@sojipay/models/Card";
import { CardFee } from "@sojipay/models/CardFee";
import { User } from "@sojipay/models/User";
import WalletService from "@sojipay/services/WalletService";
import BigNumber from "bignumber.js";
import SingleCardResponse from "@sojipay/core/cards/contracts/SingleCardResponse";
import { Transaction } from "@sojipay/models/Transaction";
import { LocalCurrency } from "@sojipay/models/LocalCurrency";
import { TransactionGroup, TransactionStatus, TransactionTypes } from "@sojipay/constants/enums/transactionType";

abstract class CardProvider {
    abstract createCard(user: User): Promise<Card>;

    abstract getCard(card: Card): Promise<SingleCardResponse>;

    abstract freezeCard(card: Card): Promise<void>;

    abstract unfreezeCard(card: Card): Promise<void>;

    abstract fundCard(card: Card, amount: number): Promise<void>;

    abstract withdraw(card: Card, amount: number): Promise<any>;

    abstract delete(card: Card): Promise<void>;

    abstract transactions(card: Card, page: number): Promise<any>;

    protected async chargeCardCreationFee(user: User, topUpAmount: number) {
        const localCurrency = await LocalCurrency.findOne();
        if(!localCurrency){
            throw new ErrorResponse("Set up local currency", StatusCodes.BAD_REQUEST);
        }

        const walletService = new WalletService();
        const cardFees = await CardFee.findOne();
        if (!cardFees) {
            throw new ErrorResponse("Setup card fees to continue", StatusCodes.BAD_REQUEST);
        }

        if(topUpAmount > 0 ){
            topUpAmount = Number(`${topUpAmount}`) +  1;
        }

        const totalAmount = Number(`${cardFees.creation_fee}`) + Number(`${topUpAmount}`);

        const amountToNaira = totalAmount * localCurrency.conversion_rate;

        const transactionAmount = BigNumber(amountToNaira);

        await walletService.validateWalletBalance(user, transactionAmount);

        await walletService.deductWallet(user, transactionAmount);

        const transaction = await Transaction.create({
            title: 'Card creation fee',
            description: 'Card creation fee',
            type: TransactionTypes.SENT,
            group: TransactionGroup.CARD,
            amount: transactionAmount.toFixed(),
            user_id: user.id,
            status: TransactionStatus.COMPLETED,
        });

        return cardFees.creation_fee;
    }
}

export default CardProvider;