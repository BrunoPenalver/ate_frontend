import User from "../user";
import Order from "./order";

export interface Export
{
    id: number;
    filename: string;
    orders: Order[];
    createdAt: string;  
    author: Omit<User, "password">;
}