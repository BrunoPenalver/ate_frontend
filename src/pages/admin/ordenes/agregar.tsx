
import { useEffect, useMemo, useState } from "react";
import HeaderLayout  from "../../../layouts/Admin"
import useAuth from "../../../hooks/auth";
import api from "../../../utils/api";
import socket from "../../../utils/socket";
import Order from "../../../components/admin/Orders/Order";

const AgregarPage = () => 
{
    useAuth();

    const [LastId, setLastId] = useState(0);
    const NewId = useMemo(() => String( LastId + 1).padStart(6,"0"), [LastId]);

    useEffect(() => 
    {
        const getLastId = async () => 
        {
            try 
            {
                const response = await api.get("/orders/lastId");
                setLastId(response.data.id);
            } 
            catch (error: any) 
            {
                console.log(error);
            }

            socket.on("new_lastId", (newId: number) => setLastId(newId));
        }

        getLastId();
    },[]);


    return <HeaderLayout>
        <h2>Orden {NewId}</h2>
        <Order type="add"/>
    </HeaderLayout>
}

export default AgregarPage