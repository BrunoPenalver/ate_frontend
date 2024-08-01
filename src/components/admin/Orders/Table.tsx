import Movement from "../../../interfaces/orders/movement";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
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
            <Column field="account.name" header="Cuenta contable"/>
            <Column header="Acciones" body={(row) => 
            {
                return <div style={{ display: "flex", gap: "10px", justifyContent: "center", textDecoration: "none",}}>
                    <i className="pi pi-pen-to-square" style={{marginRight: "10px", color: "var(--cyan-500)", cursor: "pointer"}} onClick={() =>  props.onUpdate(row)}/>
                    <i className="pi pi-trash" style={{color: "var(--red-600)", cursor: "pointer"}} onClick={() =>  onClickDelete(row.id)}/> 
                </div>
            }}/>
        </DataTable>
    </div>
}

export default TableMovimientos;