import { CardProviders } from "@sojipay/constants/enums/Cards";
import { Card } from "@sojipay/models/Card";
import ErrorResponse from "@sojipay/constants/ErrorResponse";
import StatusCodes from "@sojipay/constants/enums/StatusCodes";
import CardProvider from "@sojipay/core/cards/contracts/CardProvider";
import Bridgecard from "@sojipay/core/cards/Bridgecard";

class CardFactory {
    static init(): CardProvider {
        return new Bridgecard();
    }

    static forCard(card: Card): CardProvider {
        if(card.provider == CardProviders.BRIDGE_CARD) {
            return new Bridgecard();
        }else{
            throw new ErrorResponse("Invalid provider", StatusCodes.BAD_REQUEST);
        }
    }
}

export default CardFactory;