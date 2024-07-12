
interface AccountType
{
    id: number;
    type: string;
    createdAt: string;
    updatedAt: string;
}

export default interface Concept
{
    id: number;
    code: string;
    description: string;
    debitAccount: string;
    creditAccount: string;
    accountNumber: string;
    CBU: string;
    alias: string;
    accountTypeId: number;
    registryId: number;
    createdAt: string;
    updatedAt: string;
    accountType: AccountType;
    registryType: AccountType;
}