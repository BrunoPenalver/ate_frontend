export default interface BankAccount 
{
    id: number;
    bank: string;
    holder: string;
    number: string;
    type: string;
    CBU: string;
    alias: string;
    beneficiaryId: number;
    createdAt: string;
    updatedAt: string;
    active?: boolean;
}