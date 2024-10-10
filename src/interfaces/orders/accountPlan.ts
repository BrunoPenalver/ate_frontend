export default interface AccountPlan
{
    id: number;
    mainId: null | number;
    code: string;
    account: string;
    shortCode: number;
    balance: string;
    subAccount: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}