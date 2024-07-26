import Account from "./account"
import Concept from "./concept";
import Sectional from "./sectional";

export interface Attachment
{
    id: number;
    file: File;
}

export default interface Movement
{
    tempId?: number;
    type: "Debe" | "Haber";
    amount: number;
    concept: Concept;
    sectional: Sectional;
    origin: Account;
    destiny: Account;
    paymentDate: number;
    details: string;
    attachments: Attachment[];
}