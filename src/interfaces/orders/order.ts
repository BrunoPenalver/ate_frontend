import Movement from "./movement";

export default interface Order
{
    id: number;
    date: string;
    description: string;
    state: string;
    createdAt: string;
    updatedAt: string;
    paymentDate: string;
    movements: Movement[];
    active: boolean;
    lastModifiedBy: string;
    exportedAt: null | Date;
}