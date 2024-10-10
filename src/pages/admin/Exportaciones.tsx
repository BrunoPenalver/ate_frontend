import { useEffect, useState } from "react";
import useAuth from "../../hooks/auth";
import HeaderLayout  from "../../layouts/Admin"
import api from "../../utils/api";
import { Export } from "../../interfaces/orders/exports";
import { Column } from "primereact/column";
import { formatFullDate } from "../../utils/dates";
import Loading from "../../components/Loading";
import { createAlert } from "../../stores/alerts.slicer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../stores/stores";
import { StyledDataTable } from "../../components/tables/styles";
import { getExportacion } from "../../utils/exactas";
import Order from "../../interfaces/orders/order";
import { Link } from "react-router-dom";

const Exportaciones = () =>
{
    useAuth();
    const dispatch = useDispatch<AppDispatch>();

    const [isLoading, setIsLoading] = useState(true);
    const [Exports, setExports] = useState<Export[]>([]);

    useEffect(() => 
    {
        const getData = async () =>
        {
            try
            {
                const Peticion = await api.get("/orders/exports");    
                setExports(Peticion.data);
            } 
            catch (error) 
            {
               dispatch(createAlert({severity: "error", detail: "Error al cargar las exportaciones",summary: "Error"}));
            }
            finally
            {
                setIsLoading(false);
            }
        }

        getData();
    }, [])
    
    if(isLoading)
        return <HeaderLayout>
            <Loading/>
        </HeaderLayout>

    const onClickDownload = async (id: number) =>
    {
        try 
        {
            await getExportacion(id);
        } 
        catch (error) 
        {
            dispatch(createAlert({severity: "error", detail: "Error al descargar el archivo",summary: "Error"}));
        }
    }

    return <HeaderLayout>
    
        <StyledDataTable paginator rows={10} rowsPerPageOptions={[1, 2, 5, 10]} value={Exports} stripedRows emptyMessage="No se encontraron exportaciones"  size="small"> 
            <Column field="id" header="ID" sortable/>
            <Column header="Órdenes" body={row => 
            {
                return <span style={{display:"flex",gap:"5px", flexDirection:"column"}}>
                    {row.orders.map((order:Order) => <Link to={`/admin/ordenes/${order.id}`}># {order.id}</Link>)}
                </span> 
            }}/>
            <Column sortable header="Autor" body={row => <span>{row.author?.firstname} {row.author?.lastname}</span>}/>
            <Column sortable header="Fecha de creación" field="createdAt" body={row => <span>{formatFullDate(row.createdAt)}</span>}/>
            <Column header="Acciones" body={row => <i className="pi pi-download" style={{color: "var(--cyan-500)", cursor: "pointer"}} onClick={() => onClickDownload(row.id)}/>}/>
        </StyledDataTable>
    </HeaderLayout>
}

export default Exportaciones;