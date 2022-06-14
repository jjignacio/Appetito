import { Document } from "mongoose";

export interface Alias extends Document{
    option1: string;
    option2: string;
    option3: string;
    option4: boolean;
}