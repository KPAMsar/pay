import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import axios from 'axios';
import { TokenType } from '@sojipay/constants/types/file';
import { User } from '@sojipay/models/User';

dotenv.config();

class SafeHavenRequests {
    tokenFile = path.join(__dirname, '../../../storage/safehaven.json');
    constructor() {
        if (!fs.existsSync(this.tokenFile)) {
            fs.writeFileSync(this.tokenFile, '');
        }
    }

    private async getToken() {
        try {
            const fileData = await promisify(fs.readFile)(this.tokenFile, { flag: 'rs+', encoding: 'utf8' });
            let tokenData: TokenType | null = fileData ? JSON.parse(fileData) : null;

            let tDiff;
            if (tokenData) {
                const now = Date.now();

                tDiff = ((now - tokenData.date) / 1000) / 60;
                console.log(now, tokenData.date, tDiff);
                if (tDiff >= 30) {
                    tokenData = null;
                }
            }

            if (!tokenData) {
                const resp = await this.getApi().post('/oauth2/token', {
                    grant_type: 'client_credentials',
                    client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
                    client_id: process.env.SAFE_HAVEN_OAUTH_CLIENT_ID,
                    client_assertion: process.env.SAFE_HAVEN_CLIENT_ASSERTION
                });

                tokenData = {
                    token: resp.data.access_token,
                    refresh_token: resp.data.refresh_token,
                    expires_in: resp.data.expires_in,
                    ibs_client_id: resp.data.ibs_client_id,
                    date: Date.now()
                };

                await promisify(fs.writeFile)(this.tokenFile, JSON.stringify(tokenData));
            }

            return tokenData;

        } catch (error) {
            return null;
        }
    }

    async createDynamicAccount(amount: number, ref: string) {
        const token = await this.getToken();

        const api = this.getAuthApi(token!);

        const body = {
            accountName: 'Payments',
            validFor: 1800,
            callbackUrl: process.env.SAFE_HAVEN_CALLBACK,
            amountControl: 'Fixed',
            amount: amount,
            settlementAccount: {
                bankCode: "090286",
                accountNumber: process.env.SAFE_HAVEN_DEBIT_ACCOUNT,
            },
            externalReference: ref,
        }

        const resp = await api.post('/virtual-accounts', body);

        return resp.data;
    }

    async moneyTransfer(accountNumber: string, bankCode: string, amount: number, nameEnquiryReference: string, user: User) {
        const token = await this.getToken();

        const api = this.getAuthApi(token!);

        const resp = await api.post(`/transfers`, {
            nameEnquiryReference: nameEnquiryReference,
            amount: amount,
            debitAccountNumber: process.env.SAFE_HAVEN_DEBIT_ACCOUNT,
            beneficiaryBankCode: bankCode,
            beneficiaryAccountNumber: accountNumber,
            narration: `From ${user.last_name} ${user.first_name}`,
            saveBeneficiary: false,
        });

        return resp.data;
    }

    async nameEnquiry(accountNumber: string, bankCode: string) {
        const token = await this.getToken();

        const api = this.getAuthApi(token!);

        const resp = await api.post(`/transfers/name-enquiry`, {
            bankCode: bankCode,
            accountNumber: accountNumber
        });

        return resp.data;
    }

    async getBanks() {
        const token = await this.getToken();

        const api = this.getAuthApi(token!);

        const resp = await api.get(`/transfers/banks`);

        return resp.data;
    }

    async getVirtualAccountTransactionStatus(virtualAccountId: string) {
        const token = await this.getToken();

        const api = this.getAuthApi(token!);

        const resp = await api.get(`/virtual-accounts/${virtualAccountId}/transaction`);

        return resp.data;
    }

    async getServices() {
        const token = await this.getToken();

        const api = this.getAuthApi(token!);

        const resp = await api.get(`/vas/services`);

        return resp.data;
    }

    async getServiceCategories(serviceId: string) {
        const token = await this.getToken();

        const api = this.getAuthApi(token!);

        const resp = await api.get(`/vas/service/${serviceId}/service-categories`);

        return resp.data;
    }

    async getServiceProducts(serviceCategoryId: string) {

        const token = await this.getToken();

        const api = this.getAuthApi(token!);

        const resp = await api.get(`/vas/service-category/${serviceCategoryId}/products`);

        return resp.data;
    }

    async buyAirtime(serviceCategoryId: string, amount: number, phoneNumber: string) {
        const token = await this.getToken();

        const api = this.getAuthApi(token!);

        const body = {
            serviceCategoryId: serviceCategoryId,
            amount: amount,
            channel: 'WEB',
            debitAccountNumber: process.env.SAFE_HAVEN_DEBIT_ACCOUNT,
            phoneNumber: phoneNumber
        }

        const resp = await api.post(`/vas/pay/airtime`, body);

        return resp.data;
    }

    async buyData(serviceCategoryId: string, bundleCode: string, amount: number, phoneNumber: string) {
        const token = await this.getToken();

        const api = this.getAuthApi(token!);

        const body = {
            serviceCategoryId: serviceCategoryId,
            bundleCode: bundleCode,
            amount: amount,
            channel: 'WEB',
            debitAccountNumber: process.env.SAFE_HAVEN_DEBIT_ACCOUNT,
            phoneNumber: phoneNumber
        }

        const resp = await api.post(`/vas/pay/data`, body);

        return resp.data;
    }

    async utilityVerification(serviceCategoryId: string, entityNumber: string) {
        const token = await this.getToken();

        const api = this.getAuthApi(token!);
        const body = {
            serviceCategoryId: serviceCategoryId,
            entityNumber: entityNumber,
        };

        const resp = await api.post(`/vas/verify`, body);

        return resp.data;
    }

    async purchaseElectricity(serviceCategoryId: string, meterNumber: string, amount: number, vendType: string) {
        const token = await this.getToken();

        const api = this.getAuthApi(token!);
        const body = {
            serviceCategoryId: serviceCategoryId,
            meterNumber: meterNumber,
            amount: amount,
            channel: 'WEB',
            debitAccountNumber: process.env.SAFE_HAVEN_DEBIT_ACCOUNT,
            vendType: vendType
        };

        const resp = await api.post(`/vas/pay/utility`, body);

        return resp.data;
    }

    private getAuthApi(token: TokenType) {
        const baseURL = process.env.SAFE_HAVEN_BASEURL;

        return axios.create({
            baseURL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.token}`,
                'ClientID': `${token.ibs_client_id}`
            },
        });
    }

    private getApi() {
        const baseURL = process.env.SAFE_HAVEN_BASEURL;

        return axios.create({
            baseURL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
    }
}

export default SafeHavenRequests;