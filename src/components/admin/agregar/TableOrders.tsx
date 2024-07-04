import { DataTable } from "primereact/datatable"
import { Column } from 'primereact/column';
import Order from "../../../interfaces/orders/order";
import { useMemo, useState } from "react";
import { InputText } from "primereact/inputtext";
import { ContainerPage } from "../../../styles/admin/ordenes/tableOrders";

interface TableOrdersProps
{
    orders: Order[];
}

const TableOrders = (props:TableOrdersProps) => 
{
    const { orders } = props;

    const [Search, setSearch] = useState<string>("");

    const filterOrders = useMemo(() => orders.filter((order:Order) => 
    {
        const search = Search.toLowerCase().trim();
        for(const key in order)
        {
            if(key === "date" || key === "paymentDate")
            {
                const date = new Date(order.paymentDate);
                const fulldate = `${date.getDate()}/${(date.getMonth() + 1).toString().padStart(2,"0")}/${date.getFullYear()}`
                
                if(fulldate.includes(search))
                    return true;
            }

            const keyValue = order[key as keyof Order];

            if(typeof keyValue === "string" && keyValue.toLowerCase().includes(search))
                return true;
            else if(typeof keyValue === "number" && keyValue.toString().includes(search))
                return true;

            else if(typeof keyValue === "object")
            {
                for(const key2 in keyValue)
                {
                    const value = keyValue[key2 as keyof typeof keyValue];
                    if(typeof value === "string" && value.toLowerCase().includes(search))
                        return true;
                    else if(typeof value === "number" && value.toString().includes(search))
                        return true;
                }
            }

        }
    }), [Search, orders]);  

    const formatTimestamp = (order : Order) =>
    {
        const date = new Date(order.paymentDate);
        return `${date.getDate()}/${(date.getMonth() + 1).toString().padStart(2,"0")}/${date.getFullYear()}`  //TODO: Preguntar con el 0 o sin el 0
    }

    return <ContainerPage>
        <InputText value={Search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar"/>
        <DataTable size="small" emptyMessage="No hay órdenes cargadas" value={filterOrders} stripedRows paginator rows={10} rowsPerPageOptions={[1, 2, 5, 10]}>
            <Column  sortable  field="amount" header="Importe"/>
            <Column  sortable  header="Concepto" field="concept.id"/>
            <Column  sortable  header="Descripción del Concepto" field="concept.name"/>
            <Column  sortable  header="Seccional" field="sectional.id"/>
            <Column  sortable  header="Descripción de la seccional" field="sectional.name"/>
            <Column  sortable  header="Proovedor" field="destination.id"/>
            <Column  sortable  header="Razón social (Proovedor)" field="destination.id"/>
            <Column  sortable  header="Titual (Proovedor)" field="destinationBank.owner"/>
            <Column  sortable  header="Nro de Cuenta (Proovedor)" field="destinationBank.account"/>
            <Column  sortable  header="CBU (Proovedor)" field="destinationBank.cbu"/>
            <Column  sortable  header="Banco (ATE)" field="originBank.name"/>
            <Column  sortable  header="Nombre del Banco (ATE)" field="originBank.account"/>
            <Column  sortable  header="Nro de Cuenta (ATE)" field="originBank.cbu"/>
            <Column  sortable  header="CBU (ATE)" field="originBank.cbu"/>
            <Column  sortable  header="Observaciones" field="details"/>

            <Column  sortable  header="Nro de Cheque" field="numberCheck"/>
            <Column  sortable  header="Fecha Cobro de Cheque" field="paymentDate" body={formatTimestamp}/> 
            <Column  sortable  header="Detalles adicionales" field="extraDetails"/>
            <Column  sortable  header="CUIT Beneficiario" field="destination.cuit"/>
        </DataTable>
    </ContainerPage>
}

export default TableOrders;