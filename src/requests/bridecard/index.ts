import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

const bridgecardRequestsApi = axios.create({
  timeout: 45000,
  baseURL: process.env.BRIDGECARD_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'token': `Bearer ${process.env.BRIDGECARD_AUTH_TOKEN}`
  },
});

export default bridgecardRequestsApi;