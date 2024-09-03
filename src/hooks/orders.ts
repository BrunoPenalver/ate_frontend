import { useState , useEffect } from "react";
import api from "../utils/api";
import Order from "../interfaces/orders/order";


export default function useOrders(filters: string = "")
{
    const [LoadingOrders, setLoadingOrders] = useState(true);
    const [Orders, setOrders] = useState<Order[]>([]);

    const fetchOrders = async () => 
    {
        try 
        {
            setLoadingOrders(true);
            const response = await api.get('/orders?search=' + filters);
            setOrders(response.data);
        } 
        catch (error) 
        {
            console.log(error);
        }
        finally
        {
            setLoadingOrders(false);
        }
    }

    useEffect(() => 
    {
        fetchOrders();
    }, [filters]);


    return { LoadingOrders, Orders  };
}