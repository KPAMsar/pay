import { User } from "@sojipay/models/User";
import vtpassRequestsApi from ".";

class VtpassRequests {
    static async buyAirtime(user: User, serviceID: string, amount: number, phone: string) {

        const body = {
            request_id: VtpassRequests.getRequestId(user),
            serviceID: serviceID,
            amount: amount,
            phone: phone
        };

        const resp = await vtpassRequestsApi.post(`/pay`, body);

        return resp.data;
    }

    static async dataPlans(serviceID: string) {
        const resp = await vtpassRequestsApi.get(`/service-variations?serviceID=${serviceID}`);

        return resp.data;
    }

    static async buyData(user: User, serviceID: string, variationCode: string, phone: string) {

        const body = {
            request_id: VtpassRequests.getRequestId(user),
            serviceID: serviceID,
            billersCode: phone,
            phone: phone,
            variation_code: variationCode
        };

        const resp = await vtpassRequestsApi.post(`/pay`, body);

        return resp.data;
    }

    static async verifyMeter(meterNumber: string, serviceId: string, type: string) {
        const body = {
            billersCode: meterNumber,
            serviceID: serviceId,
            type: type
        };

        const resp = await vtpassRequestsApi.post(`/merchant-verify`, body);

        return resp.data;
    }

    static async buyElectricity(user: User, meterNumber: string, serviceId: string, type: string, amount: number) {
        const body = {
            request_id: VtpassRequests.getRequestId(user),
            billersCode: meterNumber,
            serviceID: serviceId,
            variation_code: type,
            amount: amount,
            type: type,
            phone: `${user.phone_code}${user.phone}`
        };

        const resp = await vtpassRequestsApi.post(`/pay`, body);

        return resp.data;
    }

    static async tvSubscriptionPlans(serviceID: string) {
        const resp = await vtpassRequestsApi.get(`/service-variations?serviceID=${serviceID}`);

        return resp.data;
    }

    static async verifySmartcardNumber(smartcardNumber: string, provider: string) {
        const body = {
            billersCode: smartcardNumber,
            serviceID: provider,
        };

        const resp = await vtpassRequestsApi.post(`/merchant-verify`, body);

        return resp.data;
    }

    static async buyTvSubscription(user: User, smartcardNumber: string, provider: string, variationCode: string, amount: number) {
        const body = {
            request_id: VtpassRequests.getRequestId(user),
            billersCode: smartcardNumber,
            serviceID: provider,
            variation_code: variationCode,
            amount: amount,
            subscription_type: 'change',
            phone: `${user.phone_code}${user.phone}`,
            quantity: 1,
        };

        const resp = await vtpassRequestsApi.post(`/pay`, body);

        return resp.data;
    }

    static async waecVariationCodes() {
        const resp = await vtpassRequestsApi.get(`/service-variations?serviceID=waec`);

        return resp.data;
    }

    static async buyWaecPin(user: User, variationCode: string, phone: string) {
        const body = {
            request_id: VtpassRequests.getRequestId(user),
            serviceID: 'waec',
            variation_code: variationCode,
            phone: phone,
        };

        const resp = await vtpassRequestsApi.post(`/pay`, body);

        return resp.data;
    }

    static getRequestId(user: User): string {
        const date = new Date();
        const year = date.getFullYear();

        let month = `${date.getMonth() + 1}`;
        if (month.length == 1) {
            month = `0${month}`;
        }

        let day = `${date.getDate()}`;
        if (day.length == 1) {
            day = `0${day}`;
        }

        let hours = process.env.NODE_ENV == 'development' ? `${date.getHours()}` : `${(date.getHours() + 1) % 24}`;
        if (hours.length == 1) {
            hours = `0${hours}`;
        }

        let minutes = `${date.getMinutes()}`;
        if (minutes.length == 1) {
            minutes = `0${minutes}`;
        }

        return `${year}${month}${day}${hours}${minutes}${user.id}`;
    }
}

export default VtpassRequests;