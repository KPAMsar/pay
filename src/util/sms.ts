import axios from 'axios';

export const sendSMS = async (receiver: string, text: string) => {
    const data = {
        "to": receiver,
        "from": "N-Alert",
        "sms": text,
        "type": "plain",
        "api_key": process.env.TERMII_API_KEY,
        "channel": "dnd"
    };

    try {
        await axios.post(`${process.env.TERMII_BASE_URL}/sms/send`, data);
    } catch (error) {
        
    }
}