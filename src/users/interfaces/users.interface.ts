import { Document } from "mongoose";

export interface User extends Document{
    name: string;
    password: string;
    alias: string;
    enabled: boolean;
    email: string;
    role: string;
    gender: string;
    birth: string;
    createdAt: Date;
}