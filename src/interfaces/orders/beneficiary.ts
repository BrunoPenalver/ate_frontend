export interface Bank
{
    id: number;
    name: string;
    owner: string;
    account: string;
    cbu: string;
}

export default interface Beneficiary
{
    id: number,
    code: string | number;
    name: string;
    cuit: string;
    banks: Bank[];
}