import Movement from "../../../interfaces/orders/movement";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";

interface Props
{
    movimientos: Movement[];
    title: Movement["type"];
    onDelete: (id: number) => void;
    onUpdate: (toUpdate: Movement) => void;
}

const TableMovimientos = (props: Props) => 
{
    const { movimientos, title, onDelete } = props;

    const onClickDelete = (movementId: number) => 
    {
        confirmDialog({
            message: "¿Estás seguro de eliminar este movimiento?",
            header: "Confirmar",
            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-danger",
            rejectLabel: "No",
            acceptLabel: "Si",
            acceptIcon: "pi pi-trash",
            accept: () => onDelete(movementId)
        });
    }

    return <div>
        <h4>{title}</h4>
        <DataTable value={movimientos} emptyMessage="No hay movimientos cargados" stripedRows tableStyle={{ minWidth: 'auto' }}>
            <Column field="amount" header="Importe"/>
            {title === "Debe" ? <Column field="destinyBank.account" header="Cuenta contable"/> : <Column field="originBank.account" header="Cuenta contable"/>}
            {title === "Debe" ? <Column field="destiny.name" header="Nombre proveedor"/> : <Column field="origin.name" header="Nombre proveedor"/>}
            <Column header="Acciones" body={(row) => 
            {
                return <div style={{ display: "flex", gap: "10px", justifyContent: "center", textDecoration: "none",}}>
                    <Button label="Editar"   className="p-button-info"  onClick={() =>  props.onUpdate(row)}/> 
                    <Button label="Eliminar" className="p-button-danger" onClick={() =>  onClickDelete(row.tempId)}/> 
                </div>
            }}/>
        </DataTable>
    </div>
}

export default TableMovimientos;