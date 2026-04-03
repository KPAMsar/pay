export enum OTPTypes{
    ACCOUNT = 'account',
    FORGOT_PASSWORD = 'forgot password'
}

export enum OTPMedia{
    SMS = 'sms',
    EMAIL = 'email'
}

export enum SessionMethods{
    PASSWORD = 'password',
    TWO_FACTOR_AUTHENTICATION = '2fa',
    BIOMETRICS = 'biometrics',
    PIN = 'pin',
}

export enum KYCStages {
    PERSONAL_INFORMATION = 'personal information',
    ADDRESS = 'address',
    GOVERNMENT_ID = 'government id',
    LIVENESS_CHECK = 'liveness check',
    COMPLETED = 'completed'
}

export enum KYCStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

export enum KYCIDTypes {
    ID_CARD = 'id card',
    PASSPORT = 'passport',
    DRIVERS_LICENCE = 'driver\'s licence'
}