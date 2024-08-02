import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../utils/api";
import OrderComp from "../../../components/admin/Orders/Order";
import Order from "../../../interfaces/orders/order";
import HeaderLayout  from "../../../layouts/Admin"
import useAuth from "../../../hooks/auth";
import Loading from "../../../components/Loading";

const OrderEdit = () => 
{
    useAuth();

    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [OrderFound, setOrder] = useState<Order>();


    useEffect(() => 
    {
        const getData = async () =>
        {
            try 
            {
                const peticion = await api.get<Order>(`/orders/${id}`);   
                setOrder(peticion.data);
            } 
            catch (error) 
            {
                
            }
            finally
            {
                setIsLoading(false);    
            }
        }

        getData();
    }, []);

    if(isLoading)
        return <HeaderLayout>
            <Loading/>
        </HeaderLayout>

    if(!OrderFound)
        return <HeaderLayout>
            <h2>Orden no encontrada</h2>
        </HeaderLayout>

    return <HeaderLayout>
        <h2>Orden {String(id).padStart(6,"0")}</h2>
        <OrderComp type="edit" values={OrderFound}/>
    </HeaderLayout>
}

export default OrderEdit;
