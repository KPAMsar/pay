import ErrorResponse from "@sojipay/constants/ErrorResponse";
import StatusCodes from "@sojipay/constants/enums/StatusCodes";
import { Card } from "@sojipay/models/Card";
import { KYC } from "@sojipay/models/KYC";
import { User } from "@sojipay/models/User";
import bridgecardRequestsApi from "@sojipay/requests/bridecard";
import axios from "axios";
import generateUniqueId from 'generate-unique-id';
const AES256 = require('aes-everywhere');

class BridgecardRequests {
    static async createCardholder(user: User) {
        try {
            const kyc = await KYC.findOne({ where: { user_id: user.id } });
            if (!kyc) {
                throw new ErrorResponse("KYC not found", StatusCodes.BAD_REQUEST);
            }

            let state = kyc.kyc_data.state.replace(" State", "").replace(" Province", "").replace(" Region", "").replace("-", ' ');

            const body = {
                first_name: user.first_name,
                last_name: user.last_name,
                address: {
                    address: kyc.kyc_data.residentialAddress,
                    city: kyc.kyc_data.stateOfResidence.split(" ")[0],
                    state: state,
                    country: kyc.kyc_data.nationality,
                    house_no: kyc.kyc_data.residentialAddress.split(" ")[0]
                },
                phone: `${user.phone_code}${user.phone}`,
                email_address: user.email,
                identity: {
                    id_type: 'NIGERIAN_BVN_VERIFICATION',
                    bvn: kyc.bvn,
                    selfie_image: kyc.image
                },
                meta_data: { user_id: user.id }
            };

            const resp = await bridgecardRequestsApi.post(`/cardholder/register_cardholder_synchronously`, body);

            return resp.data;
        } catch (error: any) {
            throw new ErrorResponse(error.response.data.message ?? "An error occurred", StatusCodes.UNPROCESSABLE_ENTITY);
        }
    }

    static async createCard(cardHolderId: string, brand: string, userId: string) {
        try {
            let body = {
                cardholder_id: cardHolderId,
                card_type: "virtual",
                card_brand: brand,
                card_currency: "USD",
                meta_data: {
                    user_id: userId
                }
            };

            const resp = await bridgecardRequestsApi.post('/cards/create_card', body);

            return resp.data;
        } catch (error: any) {
            throw new ErrorResponse(error.response.data.message ?? "An error occurred", StatusCodes.UNPROCESSABLE_ENTITY);
        }
    }

    static async getCardDetails(cardId: string) {
        try {
            const api = axios.create({
                baseURL: process.env.BRIDGECARD_BASE_URL_ALT,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'token': `Bearer ${process.env.BRIDGECARD_AUTH_TOKEN}`
                },
            });

            const resp = await api.get(`/cards/get_card_details?card_id=${cardId}`);

            return resp.data;
        } catch (error: any) {
            throw new ErrorResponse(error.response.data.message ?? "An error occurred", StatusCodes.UNPROCESSABLE_ENTITY);
        }
    }

    static async freezeCard(cardId: string) {
        try {
            const resp = await bridgecardRequestsApi.patch(`/cards/freeze_card?card_id=${cardId}`);

            return resp.data
        } catch (error: any) {
            throw new ErrorResponse(error.response.data.message ?? "An error occurred", StatusCodes.UNPROCESSABLE_ENTITY);
        }
    }

    static async unfreezeCard(cardId: string) {
        try {
            const resp = await bridgecardRequestsApi.patch(`/cards/unfreeze_card?card_id=${cardId}`);

            return resp.data
        } catch (error: any) {
            throw new ErrorResponse(error.response.data.message ?? "An error occurred", StatusCodes.UNPROCESSABLE_ENTITY);
        }
    }

    static async fundCard(card: Card, amount: number) {
        try {
            const body = {
                card_id: card.card_id,
                amount: amount * 100,
                transaction_reference: generateUniqueId({ length: 32, useLetters: true, useNumbers: true }),
                currency: "USD"
            }

            const resp = await bridgecardRequestsApi.patch(`/cards/fund_card_asynchronously`, body);

            return resp.data
        } catch (error: any) {
            throw new ErrorResponse(error.response.data.message ?? "An error occurred", StatusCodes.UNPROCESSABLE_ENTITY);
        }
    }

    static async getCardTransactions(card: Card, page: number) {
        try {
            const resp = await bridgecardRequestsApi.get(`/cards/get_card_transactions?card_id=${card.card_id}&page=${page}`);

            return resp.data
        } catch (error: any) {
            throw new ErrorResponse(error.response.data.message ?? "An error occurred", StatusCodes.UNPROCESSABLE_ENTITY);
        }
    }

    static async withdrawFromCard(card: Card, amount: number) {
        try {
            const body = {
                card_id: card.card_id,
                amount: amount * 100,
                transaction_reference: generateUniqueId({ length: 32, useLetters: true, useNumbers: true }),
                currency: "USD"
            }

            const resp = await bridgecardRequestsApi.patch(`/cards/unload_card_asynchronously`, body);

            return resp.data
        } catch (error: any) {
            throw new ErrorResponse(error.response.data.message ?? "An error occurred", StatusCodes.UNPROCESSABLE_ENTITY);
        }
    }

    static async deleteCard(card: Card) {
        try {
            const resp = await bridgecardRequestsApi.delete(`/cards/delete_card/${card.card_id}`);

            return resp.data
        } catch (error: any) {
            throw new ErrorResponse(error.response.data.message ?? "An error occurred", StatusCodes.UNPROCESSABLE_ENTITY);
        }
    }

    static async getCardBalance(card: Card) {
        try {
            const resp = await bridgecardRequestsApi.get(`/cards/get_card_balance?card_id=${card.card_id}`);

            return resp.data
        } catch (error: any) {
            throw new ErrorResponse(error.response.data.message ?? "An error occurred", StatusCodes.UNPROCESSABLE_ENTITY);
        }
    }
}

export default BridgecardRequests;