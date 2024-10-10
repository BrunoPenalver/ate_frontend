import { useEffect, useMemo, useState } from "react";
import { TableContainer, StyledDataTable, TitleGroup } from "../styles";
import { Column } from "primereact/column";
import { formatDate, formatFullDate } from "../../../utils/dates";
import { Loader } from "../../Loader";
import { AppDispatch, RootState } from "../../../stores/stores";
import { useDispatch, useSelector } from "react-redux";
import { deleteByIdForce, fetchOrders, reopenById, exports } from "../../../stores/orders.slice";
import { setSpanishLocale } from "../../../utils/locale";
import { locale } from "primereact/api";
import { confirmDialog } from "primereact/confirmdialog";
import api from "../../../utils/api";
import { createAlert } from "../../../stores/alerts.slicer";
import { deleteById } from '../../../stores/orders.slice';
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { formatPrice } from "../../../utils/prices";
import { InputText } from "primereact/inputtext";
import Order from "../../../interfaces/orders/order";
import { DataTableDataSelectableEvent } from "primereact/datatable";
import { getExportacion } from "../../../utils/exactas";
import { getPDF } from "../../../utils/ordenes";

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

      for (const movement of order.movements) 
      {
        if(movement.beneficiary.businessName.toLowerCase().includes(searchSanitized)) return true;
      }
    });
  }, [orders, globalFilter]);

  const [selectedProducts, setSelectedProducts] = useState<Order[]>([]);

  const showExport = useMemo(() => selectedProducts.length > 0, [selectedProducts]);

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

  const onClickRevertClosed = (orderId: number) =>
  {
    const reOpenOrder = async (orderId: number) =>
    {
      try 
      {
        await api.put(`/orders/${orderId}/reopen`);  

    
        dispatch(createAlert({severity: "success", summary: "Orden abierta", detail: `La orden fue abierta permanentemente`}));
        dispatch(reopenById(orderId));
      } 
      catch (error) 
      {
        dispatch(createAlert({severity: "error", summary: "Error", detail: `Hubo un error al abierta la orden`}));
      }
    }
  
    confirmDialog({
      message: `¿Estás seguro que deseas reabrir la orden ${orderId}?`,
      acceptLabel: "Si",
      rejectLabel: "No",
      header: "Confirmar re-apertura",
      icon: "pi pi-exclamation-triangle",
      accept: () => reOpenOrder(orderId),
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

  const confirmDialogExport = async () =>
  {
    try 
    {
      const payload = selectedProducts.map(order => order.id);
 
      const { data } = await api.put("/orders/exports", {orders: payload});

      const { exportedAt, orders, exportId } = data;

      dispatch(exports({orders, exportedAt }));
      await getExportacion(exportId);

      const detail = orders.length === 1 ? `La orden fue exportada correctamente` : `Las órdenes fueron exportadas correctamente`;
      dispatch(createAlert({severity: "success", summary: "Exportación", detail }));
    } 
    catch (error)
    {
      console.log(error);
      dispatch(createAlert({severity: "error", summary: "Error", detail: `Hubo un error al exportar las órdenes`}));  
    }
  }

  const onClickPDF = async (id: number) =>
  {
    try 
    {
      await getPDF(id);
    } 
    catch (error) 
    {
      dispatch(createAlert({severity: "error", detail: "Error al descargar el archivo",summary: "Error"}));
    }
  }

  const onClickExport = () =>
  {
    const ordersIds = selectedProducts.map(order => order.id);
    const message  = ordersIds.length === 1 ? `la orden ${ordersIds}` : `las órdenes ${ordersIds.join(",")}`;

    confirmDialog({
      message: `¿Estás seguro que deseas exportar ${message}?`,
      acceptLabel: "Si",
      rejectLabel: "No",
      header: "Confirmar exportación",
      icon: "pi pi-exclamation-triangle",
      accept: confirmDialogExport,
      reject: () => null
    });
  }

  const onChangeSelection = (e: any ) =>
  {
    const { value: ordersSelecteds } = e as {value: Order[]};
    setSelectedProducts(ordersSelecteds);
  }

  const isSelectable = (order: any) => order.exportedAt === null && order.state === "Cerrada";

  const isRowSelectable = (event: DataTableDataSelectableEvent) => (event.data ? isSelectable(event.data) : true);

  return (
    <TableContainer>
      <TitleGroup>
        <InputText placeholder="Buscar..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)}/>
        <div>
          <Link to="/admin/ordenes/agregar" style={{textDecoration:"none"}}> <Button label="Agregar Orden"  color="#1da750"/>  </Link>
          <Button label="Exportar a Exactas" visible={showExport}  onClick={onClickExport}  color="#1da750"/>
        </div>
      </TitleGroup>


      <StyledDataTable value={OrdersFiltereds} paginator rows={10} rowsPerPageOptions={[1, 2, 5, 10]} stripedRows size="small" removableSort emptyMessage="No hay órdenes"  selectionMode={true ? null : 'checkbox'} selection={selectedProducts} onSelectionChange={onChangeSelection}  isDataSelectable={isRowSelectable}>
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
          const { id , state, exportedAt } = row as Order;

          return <div style={{display:"flex",justifyContent:"flex-end"}}>
            {(state === "Cerrada" && <i className="pi pi-file-pdf" style={{marginRight: "10px", color: "red", cursor: "pointer"}} onClick={() => onClickPDF(id)}  />)}
            {(useActiveOrders &&  state !== "Abierta"  )&& <Link style={{textDecoration:"none"}} to={`/admin/ordenes/${id}`}> <i className="pi pi-pen-to-square" style={{marginRight: "10px", color: "var(--cyan-500)"}}/> </Link>}
            {(useActiveOrders &&  state === "Abierta"  )&& <Link style={{textDecoration:"none"}} to={`/admin/ordenes/${id}`}> <i className="pi pi-eye" style={{marginRight: "10px", color: "var(--cyan-500)"}}/> </Link>}
            {!useActiveOrders &&  <i className="pi pi-undo" style={{marginRight: "10px", color: "var(--cyan-500)", cursor: "pointer"}} onClick={() => onClickUndo(id)}  />}
            { (state === "Cerrada" && exportedAt === null) && <i className="pi pi-lock-open" style={{marginRight: "10px", color: "var(--cyan-500)", cursor: "pointer"}} onClick={() => onClickRevertClosed(id)}  />}
            <i className="pi pi-trash" style={{color: "var(--red-600)", cursor: "pointer"}} onClick={() => onClickDelete(id)}/>  
          </div>
        }}/>

    <Column selectionMode="multiple" header="Exportar"/>
       
      </StyledDataTable>
     </TableContainer>
  );
};
