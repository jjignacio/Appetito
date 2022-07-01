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
    aliasOptions1: string;
    aliasOptions2: string;
    aliasOptions3: string;
    aliasOptions4: string;
    recoveryCode: string;
    image: string;
    favorites: [
        {
            idReceta: string,
            nameReceta: string,
            image: string,
            createdAt: Date
        }
    ];
    recetas: [
        {
            idReceta: string,
            nameReceta: string,
            createdAt: Date
        }
    ];
    createdAt: Date;
}