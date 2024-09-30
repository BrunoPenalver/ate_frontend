export default interface BankAccount 
{
    id: number;
    code: string;
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
    cuit: string;
    credicoop: boolean;
}