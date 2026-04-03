interface SingleCardResponse {
    name_on_card: string,
    card_id: string,
    balance: number,
    type: string,
    brand: string,
    currency: string,
    masked_pan: string,
    card_number: string,
    expiry_month: string,
    expiry_year: string,
    last_4: string,
    cvv: string,
    billing_address: BillingAddress,
    provider: string,
    status: string,
    token: string,
}

interface BillingAddress {
    line1: string,
    line2: string,
    city: string,
    state: string,
    country: string,
    postalCode: string
}

export default SingleCardResponse;