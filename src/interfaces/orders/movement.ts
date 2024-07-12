import Account from "./account"
import Concept from "./concept";
import Sectional from "./sectional";

export default interface Movement
{
    tempId?: number;
    type: "Debe" | "Haber";
    amount: number;
    concept: Concept;
    sectional: Sectional;
    origin: Account;
    destiny: Account;
    numberCheck: number;
    paymentDate: number;
    details: string;
    extraDetails: string;
}