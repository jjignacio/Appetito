import { Schema } from "mongoose";

export const UserSchema = new Schema ({

    name: { type: String },
    password: String,
    alias: { type: String, required: true },
    enabled: { type: Boolean },
    email: { type: String, required: true },
    role: { type: String },
    gender: { type: String },
    birth: { type: String },
    aliasOptions1: { type: String },
    aliasOptions2: { type: String },
    aliasOptions3: { type: String },
    aliasOptions4: { type: String },
    recoveryCode: { type: String },
    createdAt: {
        type: Date,
        default: Date.now
    }
    
})