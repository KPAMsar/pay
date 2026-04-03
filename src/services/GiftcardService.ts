import ErrorResponse from "@sojipay/constants/ErrorResponse";
import StatusCodes from "@sojipay/constants/enums/StatusCodes";
import { GiftcardStatus, TransactionGroup, TransactionStatus, TransactionTypes } from "@sojipay/constants/enums/transactionType";
import { Giftcard } from "@sojipay/models/Giftcard";
import { GiftcardSale } from "@sojipay/models/GiftcardSale";
import { Transaction } from "@sojipay/models/Transaction";
import { User } from "@sojipay/models/User";
import { Op } from "sequelize";
import WalletService from "./WalletService";
import BigNumber from "bignumber.js";

class GiftcardService {
    public async getAll() {
        const giftcards = await Giftcard.findAll({ attributes: { exclude: ['created_at', 'updated_at'] } });

        return giftcards;
    }

    public async sellGiftcard(user: User, giftcardId: string, cardNumber: string, pin: string, value: number, image: string) {
        const transaction = await Transaction.create({
            title: 'Sold Giftcard',
            description: 'Sold Giftcard',
            type: TransactionTypes.RECEIVED,
            group: TransactionGroup.GIFTCARD,
            amount: value * 100,
            user_id: user.id,
        });

        await GiftcardSale.create({
            card_number: cardNumber,
            security_code: pin,
            value: value * 100,
            image: image,
            status: GiftcardStatus.PENDING,
            user_id: user.id,
            giftcard_id: giftcardId,
            transaction_id: transaction.id,
        });
    }

    public async adminGetGiftcards(page: number) {
        const offset = (page - 1) * 20;

        const giftcards = await GiftcardSale.findAll({
            where: { status: { [Op.ne]: GiftcardStatus.PENDING } },
            include: [{ model: User, attributes: ['id', 'first_name', 'last_name'] }, { model: Giftcard, attributes: ['id', 'name'] }],
            limit: 20,
            offset: offset,
            order: [['created_at', 'DESC']],
        });

        const total = await GiftcardSale.count({ where: { status: { [Op.ne]: GiftcardStatus.PENDING } } });

        return {
            data: giftcards,
            metadata: {
                total: total,
                currentPage: page,
                nextPage: total > (offset + 20) ? page + 1 : null,
                previousPage: page > 1 ? page - 1 : null,
            },
        };
    }

    public async adminGetPendingGiftcards(page: number) {
        const offset = (page - 1) * 20;

        const giftcards = await GiftcardSale.findAll({
            where: { status: GiftcardStatus.PENDING },
            include: [{ model: User, attributes: ['id', 'first_name', 'last_name'] }, { model: Giftcard, attributes: ['id', 'name'] }],
            limit: 20,
            offset: offset,
            order: [['created_at', 'DESC']],
        });

        const total = await GiftcardSale.count({ where: { status: GiftcardStatus.PENDING } });

        return {
            data: giftcards,
            metadata: {
                total: total,
                currentPage: page,
                nextPage: total > (offset + 20) ? page + 1 : null,
                previousPage: page > 1 ? page - 1 : null,
            },
        };
    }

    public async AdminGetGiftcard(giftcardId: string) {
        const giftcard = await GiftcardSale.findByPk(giftcardId, {
            include: [{ model: User, attributes: ['id', 'first_name', 'last_name', 'phone_code', 'phone', 'email'] }, { model: Giftcard, attributes: ['id', 'name'] }]
        });

        return giftcard;
    }

    public async processGiftcard(giftcardId: string, status: string) {
        const giftcard: ({ [key: string]: any } & GiftcardSale) | null = await GiftcardSale.findByPk(giftcardId);

        if (!giftcard) {
            throw new ErrorResponse("Invalid giftcard id", StatusCodes.BAD_REQUEST);
        }

        await giftcard.update({ status: status == 'valid' ? GiftcardStatus.VALID : GiftcardStatus.INVALID });

        const user = await User.findByPk(giftcard.user_id);

        if (status == 'valid') {

            await Transaction.update({ status: TransactionStatus.COMPLETED }, { where: { id: giftcard.transaction_id } });

            (new WalletService()).topupWallet(user!, BigNumber(giftcard.value));
        }
    }
}

export default GiftcardService;