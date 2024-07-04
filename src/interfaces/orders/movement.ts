import Beneficiary, { Bank } from "./beneficiary";
import Concept from "./concept";
import Sectional from "./sectional";

export default interface Movement
{
    tempId?: number;
    type: "Debe" | "Haber";
    amount: number;
    concept: Concept;
    sectional: Sectional;
    origin: Beneficiary;
    destiny: Beneficiary;
    originBank: Bank;
    destinyBank: Bank;
    numberCheck: number;
    paymentDate: number;
    details: string;
    extraDetails: string;
}