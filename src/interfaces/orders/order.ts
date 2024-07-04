import Beneficiary, { Bank } from "./beneficiary";
import Concept from "./concept";
import Sectional from "./sectional";

export default interface Order
{
    date: any;
    type: "Debe" | "Haber";
    amount: number;
    concept: Concept;
    sectional: Sectional;
    origin: Beneficiary;
    originBank: Bank;
    destination: Beneficiary;
    destinationBank: Bank;
    numberCheck: string;
    paymentDate: any;
    details: string;
    extraDetails: string;
    
}