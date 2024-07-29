import Account from "./account"
import BankAccount from "./bankAccount";
import Beneficiary from "./beneficiary";
import Concept from "./concept";
import Sectional from "./sectional";

export interface Attachment
{
    id: string;
    file: File;
}

export default interface Movement
{
    tempId?: number;
    type: "Debe" | "Haber";
    description: string;
    amount: number;
    paymentType: any;
    operation: string;
    holder: string;
    concept: Concept;
    beneficiary: Beneficiary;
    bankAccount: BankAccount
    sectional: Sectional;
    account: Account;
    details: string;
    attachments: Attachment[];

}