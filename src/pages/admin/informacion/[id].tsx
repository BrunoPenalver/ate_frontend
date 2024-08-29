import { useParams } from "react-router-dom";
import useAuth from "../../../hooks/auth";
import AdminLayout from "../../../layouts/Admin";
import { useMastersCRUD } from "../../../hooks/mastersCRUD";
import MasterCRUDComp from "../../../components/admin/masterCRUDComponent/MasterCrudComponent";
import { MasterCRUD } from "../../../models/mastersModel";

const MasterCrudPage = () => 
{
    useAuth();

    const { title } = useParams();
    const mastercrud = useMastersCRUD(title) as MasterCRUD | undefined;

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