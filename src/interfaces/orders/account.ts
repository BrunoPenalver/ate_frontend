import Bank from "./bankAccount";

export default interface Account 
{
    id: number;
    code: string;
    number: string;
    name: string;
    bankAccount: Bank;
    bankAccountId: number;
    createdAt: string;
    updatedAt: string;
}