export enum TransactionTypes {
    SENT = 'sent',
    RECEIVED = 'received',
}

export enum TransactionStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
    CANCELLED = 'cancelled',
}

export enum TransactionGroup {
    GIFTCARD = 'giftcard',
    AIRTIME = 'airtime',
    DATA = 'data',
    ELECTRICITY = 'electricity',
    TV = 'tv',
    EDUCATION = 'education',
    CARD = 'card',
}

export enum GiftcardStatus {
    PENDING = 'pending',
    VALID = 'valid',
    INVALID = 'invalid'
}