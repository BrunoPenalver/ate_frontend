import { useEffect, useMemo, useState } from "react";
import { OrdersTableFilter } from "./OrdersTableFilter";
import { Group } from "../../Group";
import { TableContainer, StyledDataTable, TableTitle, TitleGroup } from "../styles";
import { Column } from "primereact/column";
import { formatDate, formatFullDate } from "../../../utils/dates";
import { Loader } from "../../Loader";
import { AppDispatch, RootState } from "../../../stores/stores";
import { useDispatch, useSelector } from "react-redux";
import { deleteByIdForce, fetchOrders } from "../../../stores/orders.slice";
import { setSpanishLocale } from "../../../utils/locale";
import { locale } from "primereact/api";
import { confirmDialog } from "primereact/confirmdialog";
import api from "../../../utils/api";
import { createAlert } from "../../../stores/alerts.slicer";
import { deleteById } from '../../../stores/orders.slice';
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { formatPrice } from "../../../utils/prices";

interface Props
{
  useActiveOrders: boolean;
}

export const StyledTable = (props:Props) => 
{
  const { useActiveOrders } = props;

  const [globalFilter, setGlobalFilter] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const { orders, loading } = useSelector((state: RootState) => state.orders);

  const OrdersFiltereds = useMemo(() => 
  {
    const searchSanitized = globalFilter.toLowerCase().trim();

    return orders.filter(order => 
    {
      if(order.active !== useActiveOrders) return false;

      if(order.id.toString().includes(searchSanitized)) return true;
      if(formatDate(order.date.toString()).includes(searchSanitized)) return true;
      if(order.description.toLowerCase().includes(searchSanitized)) return true;
      if(order.state.toLowerCase().includes(searchSanitized)) return true;
      if(order.movements.length.toString().includes(searchSanitized)) return true;

      const totalDebe = order.movements.filter((mov: any) => mov.type === "Debe").reduce((acc: number, mov: any) => acc + mov.amount, 0);
      const totalHaber = order.movements.filter((mov: any) => mov.type === "Haber").reduce((acc: number, mov: any) => acc + mov.amount, 0);

      if((totalDebe - totalHaber).toString().includes(searchSanitized)) return true;
    });
  }, [orders, globalFilter]);

  useEffect(() => {
    setSpanishLocale()
    locale("es")
    dispatch(fetchOrders(""));
  }, [dispatch]);

  if (loading) 
    return <Loader text="Cargando ordenes de pago" />;
  

  const onClickDelete = (orderId: number) => 
  {
    console.log(orderId);

    const deleteOrder = async (orderId: number) =>
    {
      try 
      {
        await api.delete(`/orders/${orderId}?force=${!useActiveOrders}`);  

        if(useActiveOrders)
        {
          dispatch(createAlert({severity: "success", summary: "Orden eliminada", detail: `La orden fue eliminada correctamente`}));
          dispatch(deleteById(orderId));
          return;
        }

        dispatch(createAlert({severity: "success", summary: "Orden eliminada", detail: `La orden fue eliminada permanentemente`}));
        dispatch(deleteByIdForce(orderId));
      } 
      catch (error) 
      {
        dispatch(createAlert({severity: "error", summary: "Error", detail: `Hubo un error al eliminar la orden`}));
      }
    }

    confirmDialog({
      message: `¿Estás seguro que deseas eliminar ${!useActiveOrders ? "permanentente": ""} la orden ${orderId}?`,
      acceptLabel: "Si",
      rejectLabel: "No",
      acceptClassName: "p-button-danger",
      header: "Confirmar eliminación",
      icon: "pi pi-exclamation-triangle",
      accept: () => deleteOrder(orderId),
      reject: () => null
    });

  }

  const onClickUndo = (orderId: number) =>
  {
    const undoOrder = async (orderId: number) =>
    {
      try 
      {
        await api.put(`/orders/${orderId}/undo`);  

    
        dispatch(createAlert({severity: "success", summary: "Orden eliminada", detail: `La orden fue restaurada permanentemente`}));
        dispatch(deleteByIdForce(orderId));
      } 
      catch (error) 
      {
        dispatch(createAlert({severity: "error", summary: "Error", detail: `Hubo un error al restaurar la orden`}));
      }
    }
  
    confirmDialog({
      message: `¿Estás seguro que deseas revertir la orden ${orderId}?`,
      acceptLabel: "Si",
      rejectLabel: "No",
      header: "Confirmar restauración",
      icon: "pi pi-exclamation-triangle",
      accept: () => undoOrder(orderId),
      reject: () => null
    });
  }

  return (
    <TableContainer>
      <TitleGroup>
        <Group>
          <TableTitle>Ordenes de pago {!useActiveOrders && "eliminadas"}</TableTitle>
          <OrdersTableFilter filter={globalFilter} setFilter={setGlobalFilter}/>
        </Group>
        <Link to="/admin/ordenes/agregar"> <Button label="Agregar Orden"  color="#1da750"/>  </Link>
      </TitleGroup>
      <StyledDataTable value={OrdersFiltereds} paginator rows={10} rowsPerPageOptions={[1, 2, 5, 10]} stripedRows size="small" removableSort emptyMessage="No hay órdenes">

        <Column sortable filter filterPlaceholder="Filtrar..." field="id" header="Número de Orden"/>
        <Column filterPlaceholder="Filtrar..." field="date" header="Fecha" body={row => formatDate(row.date)}/>
        <Column sortable filter filterPlaceholder="Filtrar..." field="description" header="Descripción"/>
        <Column sortable filter filterPlaceholder="Filtrar..." field="state" header="Estado"/>

      
        <Column sortable filter filterPlaceholder="Filtrar..." field="total" header="Total" body={row =>
        {
          const totalDebe  = row.movements.filter((mov: any) => mov.type === "Debe").reduce((acc: number, mov: any) => acc + mov.amount, 0);
          const totalHaber = row.movements.filter((mov: any) => mov.type === "Haber").reduce((acc: number, mov: any) => acc + mov.amount, 0);

          return `$ ${formatPrice(totalDebe - totalHaber)}`;
        }}/>
        <Column sortable filter filterPlaceholder="Filtrar..." field="lastModifiedBy" header="Ultima actualización" />
        <Column sortable filter filterPlaceholder="Filtrar..." field="exportedAt" header="Fecha de exportación" body={row => formatFullDate(row.exportedAt)}/>
        <Column key="actions" header="Acciones" body={(row) => 
        {
          return <>
            {useActiveOrders &&   <Link style={{textDecoration:"none"}} to={`/admin/ordenes/${row.id}`}> <i className="pi pi-pen-to-square" style={{marginRight: "10px", color: "var(--cyan-500)"}}/> </Link>}
            {!useActiveOrders &&  <i className="pi pi-undo" style={{marginRight: "10px", color: "var(--cyan-500)", cursor: "pointer"}} onClick={() => onClickUndo(row.id)}  />}
            <i className="pi pi-trash" style={{color: "var(--red-600)", cursor: "pointer"}} onClick={() => onClickDelete(row.id)}/>  
          </>
        }}/>
      </StyledDataTable>
    </TableContainer>
  );
};
