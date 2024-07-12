
interface BeneficiaryType 
{
    id: number;
    type: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}
interface Province 
{
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
}

interface City 
{
    id: number;
    name: string;
    provinceId: number;
    createdAt: string;
    updatedAt: string;
}

export default interface Beneficiary 
{
    id: number;
    code: string;
    businessName: string;
    cuit: string;
    account: string;
    subAccount: string;
    phone: string;
    email: string;
    address: string;
    postalCode: number;
    position: string;
    observation: string;
    cityId: number;
    provinceId: number;
    beneficiaryTypeId: number;
    createdAt: string;
    updatedAt: string;
    city: City;
    province: Province;
    beneficiaryType: BeneficiaryType;
}