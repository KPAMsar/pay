import { User } from "@sojipay/models/User";
import { OtpVerification } from "@sojipay/models/OtpVerification";
import { Session } from "@sojipay/models/Session";
import { Giftcard } from "@sojipay/models/Giftcard";
import { GiftcardSale } from "@sojipay/models/GiftcardSale";
import { Wallet } from "@sojipay/models/Wallet";
import { Transaction } from "@sojipay/models/Transaction";
import { KYC } from "@sojipay/models/KYC";
import { LocalCurrency } from "@sojipay/models/LocalCurrency";
import { Card } from "@sojipay/models/Card";
import { Cardholder } from "@sojipay/models/Cardholder";

const models = [
    User,
    OtpVerification,
    Session,
    Giftcard,
    Wallet,
    Transaction,
    GiftcardSale,
    KYC,
    LocalCurrency,
    Cardholder,
    Card
];

export default models;