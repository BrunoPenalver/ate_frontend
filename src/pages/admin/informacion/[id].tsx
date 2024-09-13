import { useParams } from "react-router-dom";
import useAuth from "../../../hooks/auth";
import AdminLayout from "../../../layouts/Admin";
import { useMastersCRUD } from "../../../hooks/mastersCRUD";
import MasterCRUDComp from "../../../components/admin/masterCRUDComponent/MasterCrudComponent";
import { MasterCRUD } from "../../../models/mastersModel";
import { useEffect } from "react";
import socket from "../../../utils/socket";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../stores/stores";
import { createAlert } from "../../../stores/alerts.slicer";


const MasterCrudPage = () => 
{
    useAuth();

    const { title } = useParams();

    const mastercrud = useMastersCRUD(title) as MasterCRUD | undefined;
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => 
        {
        socket.on('invalid-Concept', (errorMessage) => {  // Recibir el mensaje del servidor
            dispatch(createAlert({
                summary: "Error de CBU",
                detail: errorMessage,  // Utilizar el mensaje recibido
                severity: "error"
            }));
        });
    
        // Limpia el socket cuando el componente se desmonte
        return () => {
            socket.off('invalid-Concept');
        };
    }, []);

    if(!mastercrud) 
    {
        return <AdminLayout>
            <h1 style={{textAlign: "center"}}>{title} no encontrado</h1>
        </AdminLayout>
    }
    

    return <AdminLayout>
        <MasterCRUDComp item={mastercrud}/>
    </AdminLayout>
}

export default MasterCrudPage;