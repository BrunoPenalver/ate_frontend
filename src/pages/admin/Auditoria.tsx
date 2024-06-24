import { useState, useEffect, useMemo } from "react";
import AdminLayout from "../../layouts/Admin";
import Log from "../../interfaces/logs";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getTranslate } from "../../utils/translates";
import { formatDate } from "../../utils/dates";
import api from "../../utils/api";
import Loading from "../../components/Loading";
import { Container } from "../../styles/admin/auditoria";
import useAuth from "../../hooks/auth";

const AuditoriaPage = () => 
{
    useAuth();

    const [Search, setSearch] = useState<string>("");
    const [Logs, setLogs] = useState<Log[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const filterLog = (log:Log) =>
    {
        const filter = Search.toLowerCase();

        const { createdAt } = log;
        const date = formatDate(createdAt);
        
        if(Search.trim() === "") return true;

        if(date.includes(filter)) return true;

        const fullName = `${log.user.firstname} ${log.user.lastname}`.toLowerCase();
        if(fullName.includes(filter)) return true;

        const action = getTranslate(log.action).toLowerCase();
        if(action.includes(filter)) return true;

        const details = log.details.text.toLowerCase();
        if(details.includes(filter)) return true;
    }

    const FilteredLogs = useMemo(() => Logs.filter(log => filterLog(log)), [Logs,Search]);

    useEffect(() => 
    {
        const fetchLogs = async () =>
        {
            try 
            {
                const { data } = await api.get("/logs");
                setLogs(data);
            }
            catch (error:any) 
            {
                console.log(error.response.data)
                //TODO: sistema de alertas con store
            }
            finally
            {
                setIsLoading(false);
            }
        }

        fetchLogs();
    },[]);


    const Table = () =>
    {
        const FechaTemplate = (rowData: Log) =>
        {
            const { createdAt } = rowData;
            return formatDate(createdAt);
        }

        const UserTemplate = (rowData: Log) =>
        {
            const { user } = rowData;
            return `${user.firstname} ${user.lastname}`;
        }

        const ActionTemplate = (rowData: Log) =>
        {
            const { action } = rowData;
            return getTranslate(action);
        }

        const DetailsTemplate = (rowData: Log) =>
        {
            const { details } = rowData;
            
            if(details.type == "text")
                return details.text

            if(details.type == "link" && details.to)
                return <Link to={details.to}>{details.text}</Link>

            return details.text;
        }

        return (
            <div>
                <DataTable value={FilteredLogs} stripedRows paginator rows={10} rowsPerPageOptions={[10,15,20]} emptyMessage="No se encontraron registros.">
                    <Column field="createdAt" header="Fecha" body={FechaTemplate}/>
                    <Column field="user.id" header="Usuario" body={UserTemplate}/>
                    <Column field="action" header="Acción" body={ActionTemplate}/>
                    <Column field="details" header="Detalles" body={DetailsTemplate}/>
                </DataTable>
            </div>
        )
    }

    if(isLoading) 
        return <AdminLayout>
            <Loading/>
        </AdminLayout>

    return  <AdminLayout>
       <Container className="container">
            <InputText placeholder="Búsqueda" value={Search} onChange={e => setSearch(e.target.value)}/>
            { Search && <p> {FilteredLogs.length} resultados </p> }
            <Table/>
       </Container>
    </AdminLayout>
}

export default AuditoriaPage;