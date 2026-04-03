import { Request } from "express";
import { User } from "@sojipay/models/User";

export interface AuthRequest extends Request{
    user?: User
}