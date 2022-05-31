import { Schema } from "mongoose";

export const UserSchema = new Schema ({

    name: { type: String, required: true },
    password: String,
    alias: { type: String, required: true },
    enabled: { type: Boolean, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    gender: { type: String, required: true },
    birth: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now
    }
    
})