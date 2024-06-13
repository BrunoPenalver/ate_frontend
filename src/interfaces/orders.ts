export interface Order {
    id: number;
    date: Date;
    description: string;
    state: string;
    total: number;
}