import AccountPlan from "./accountPlan";
import BankAccount from "./bankAccount";
import Beneficiary from "./beneficiary";
import Sectional from "./sectional";

export interface Attachment
{
    id: string;
    file: File;
}

export default interface Movement
{
    id: number;
    type: "Debe" | "Haber";
    description: string;
    amount: number;
    paymentType: any;
    operation: string;
    holder: string;
    beneficiary: Beneficiary;
    bankAccount: BankAccount
    sectional: Sectional;
    accountPlan: AccountPlan;
    details: string;
    attachments: Attachment[];

}