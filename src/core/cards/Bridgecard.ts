import ErrorResponse from "@sojipay/constants/ErrorResponse";
import { CardBrands, CardProviders, CardStatus } from "@sojipay/constants/enums/Cards";
import StatusCodes from "@sojipay/constants/enums/StatusCodes";
import CardProvider from "@sojipay/core/cards/contracts/CardProvider";
import { Card } from "@sojipay/models/Card";
import { Cardholder } from "@sojipay/models/Cardholder";
import { User } from "@sojipay/models/User";
import BridgecardRequests from "@sojipay/requests/bridecard/bridgecardRequests";
import SingleCardResponse from "@sojipay/core/cards/contracts/SingleCardResponse";
import CardService from "@sojipay/services/CardService";

class Bridgecard extends CardProvider {
    public async createCard(user: User): Promise<Card> {
        if(!user.is_kyc_completed){
            throw new ErrorResponse("Complete your KYC to create a card", StatusCodes.BAD_REQUEST);
        }

        let card = await Card.findOne({where: {user_id: user.id, is_deleted: false}});
        if(card){
            throw new ErrorResponse("You already have a card created", StatusCodes.BAD_REQUEST);
        }

        let cardholder = await Cardholder.findOne({ where: { user_id: user.id, provider: CardProviders.BRIDGE_CARD } });

        if (!cardholder) {
            const resp = await BridgecardRequests.createCardholder(user);

            cardholder = await Cardholder.create({
                cardholder_id: resp.data.cardholder_id,
                provider: CardProviders.BRIDGE_CARD,
                user_id: user.id,
            });
        }

        const creationFee = await this.chargeCardCreationFee(user, 0);

        const cardResp = await BridgecardRequests.createCard(cardholder.cardholder_id, 'Visa', user.id!);

        card = await Card.create({
            cardholder_id: cardholder.id,
            user_id: user.id,
            card_id: cardResp.data.card_id,
            currency: cardResp.data.currency,
            brand: cardResp.data.brand,
            provider: CardProviders.BRIDGE_CARD,
            status: CardStatus.ACTIVE,
            is_pin_set: (cardResp.data.brand == CardBrands.MASTER_CARD) ? true : false,
            card_creation_fee: creationFee,
            revenue: Number(`${creationFee}`) - 1,
        });

        return card;
    }

    public async getCard(card: Card): Promise<SingleCardResponse> {
        const cardData = await BridgecardRequests.getCardDetails(card.card_id);

        return {
            name_on_card: cardData.data.card_name,
            card_id: card.id,
            balance: Number(`${cardData.data.balance}`),
            type: cardData.data.card_type,
            brand: cardData.data.brand,
            currency: cardData.data.card_currency,
            masked_pan: "",
            card_number: cardData.data.card_number,
            expiry_month: cardData.data.expiry_month,
            expiry_year: cardData.data.expiry_year,
            last_4: cardData.data.last_4,
            cvv: cardData.data.cvv,
            billing_address: {
                line1: cardData.data.billing_address.billing_address1,
                line2: "",
                city: cardData.data.billing_address.billing_city,
                state: cardData.data.billing_address.state,
                country: cardData.data.billing_address.billing_country,
                postalCode: cardData.data.billing_address.billing_zip_code
            },
            provider: card.provider,
            status: cardData.data.is_active ? CardStatus.ACTIVE : CardStatus.FROZEN,
            token: "",
        }
    }

    public async freezeCard(card: Card): Promise<void> {
        if (card.status == CardStatus.FROZEN) {
            throw new ErrorResponse("The card is already froozen", StatusCodes.BAD_REQUEST);
        }

        const resp = await BridgecardRequests.freezeCard(card.card_id);
        await card.update({ status: CardStatus.FROZEN });
    }

    public async unfreezeCard(card: Card): Promise<void> {
        if (card.status == CardStatus.ACTIVE) {
            throw new ErrorResponse("The card is not froozen", StatusCodes.BAD_REQUEST);
        }

        const resp = await BridgecardRequests.unfreezeCard(card.card_id);
        await card.update({ status: CardStatus.ACTIVE });
    }

    public async fundCard(card: Card, amount: number): Promise<void> {
        const resp = await BridgecardRequests.fundCard(card, amount);

        return resp.data;
    }

    public async withdraw(card: Card, amount: number): Promise<any> {
        const resp = await BridgecardRequests.withdrawFromCard(card, amount);
        if (resp.status != 'success') {
            throw new ErrorResponse("An error occurred");
        }

        return resp.data;
    }

    public async delete(card: Card): Promise<void> {
        //get card balance
        const balanceData = await BridgecardRequests.getCardBalance(card);
        const balance = Number(`${balanceData.data.balance}`) / 100;

        if (balance > 0) {
            await (new CardService()).withdrawFromCard(card.user, balance);
        }

        //delete card
        await BridgecardRequests.deleteCard(card);

        await card.update({is_deleted: true});
    }

    public async transactions(card: Card, page: number): Promise<any> {
        const resp = await BridgecardRequests.getCardTransactions(card, page);

        return resp.data;
    }
}

export default Bridgecard;