export enum CardStatus {
    ACTIVE = 'active',
    FROZEN = 'frozen',
    DELETED = 'deleted',
    EXPIRED = 'expired',
}

export enum CardFundMethods {
    CRYPTO = 'crypto',
    FIAT = 'fiat'
}

export enum CardBrands {
    VISA = 'Visa',
    MASTER_CARD = 'MasterCard',
    VERVE = 'Verve'
}

export enum CardProviders {
    SUDO_AFRICA = 'sudoafrica',
    BRIDGE_CARD = 'bridgecard',
}

export enum CardTransactionTypes{
    CREDIT = 'credit',
    DEBIT = 'debit',
}