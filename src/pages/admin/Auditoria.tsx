import { InputText } from "primereact/inputtext";
import AdminLayout from "../../layouts/Admin";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import Log from "../../interfaces/logs";


const AuditoriaPage = () => 
{
    const [Search, setSearch] = useState<string>("");
    const [Logs, setLogs] = useState<Log[]>([]);
    const [Loading, setLoading] = useState<boolean>(false);

    useEffect(() => 
    {
        const fetchLogs = async () =>
        {
            try 
            {
                const Peticion = await api.get("/logs");
                console.log(Peticion.data);
            }
            catch (error:any) 
            {
                console.log(error.response.data)
                //TODO: sistema de alertas con store
            }
            finally
            {
                setLoading(false);
            }
        }

        fetchLogs();
    });


    return  <AdminLayout>
        <InputText placeholder="Búsqueda" value={Search} onChange={e => setSearch(e.target.value)}/>
        <p>{Search}</p>
    </AdminLayout>
}

export default AuditoriaPage;