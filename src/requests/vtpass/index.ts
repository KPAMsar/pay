import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

const vtpassRequestsApi = axios.create({
  baseURL: process.env.VTPASS_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'api-key': process.env.VTPASS_API_KEY,
    'public-key': process.env.VTPASS_PUBLIC_KEY,
    'secret-key': process.env.VTPASS_SECRET_KEY
  },
});

export default vtpassRequestsApi;