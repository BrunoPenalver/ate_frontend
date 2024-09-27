import Movement from "../../../interfaces/orders/movement";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { confirmDialog } from "primereact/confirmdialog";
import { formatPrice } from "../../../utils/prices";
import useScreenSize from "../../../hooks/useScreenSize";
import { useMemo } from "react";

interface Props
{
    movimientos: Movement[];
    title: Movement["type"];
    disableEdit: boolean;
    onDelete: (id: number) => void;
    onUpdate: (toUpdate: Movement) => void;
    onClone: (toClone: Movement) => void;
    onRotate: (toRotate: Movement) => void;
}

const TableMovimientos = (props: Props) => 
{
    const { movimientos, title, onDelete, disableEdit } = props;

    const screenSize = useScreenSize();

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

    const iconRotateDebe = useMemo(() => 
    {
        return screenSize.width > 1200 ? 'pi pi-arrow-circle-right' : 'pi pi-arrow-circle-down'
    },[screenSize.width])

    const iconRotateHaber = useMemo(() => 
    {
        return screenSize.width > 1200 ? 'pi pi-arrow-circle-left' : 'pi pi-arrow-circle-up'
    },[screenSize.width])


    return <div>
        <h4>{title}</h4>
        <DataTable value={movimientos} emptyMessage="No hay movimientos cargados" stripedRows tableStyle={{ minWidth: 'auto' }}>
            <Column header="Importe" body={(row) => `$${formatPrice(row.amount)}`}/>
            <Column field="account.name" header="Cuenta contable"/>
            <Column header="Acciones" body={(row) => 
            {
                return <div style={{ display: "flex", gap: "10px", justifyContent: "center", textDecoration: "none",}}>
                    { !disableEdit && <i className="pi pi-copy" style={{marginRight: "10px", color: "var(--cyan-500)", cursor: "pointer"}} onClick={() =>  props.onClone(row)}/> }
                    { !disableEdit && <i className={row.type === "Debe" ? iconRotateDebe : iconRotateHaber} style={{marginRight: "10px", color: "var(--cyan-500)", cursor: "pointer"}} onClick={() =>  props.onRotate(row)}/> }
                    <i className={!disableEdit ? 'pi pi-pen-to-square' : 'pi pi pi-eye' } style={{marginRight: "10px", color: "var(--cyan-500)", cursor: "pointer"}} onClick={() =>  props.onUpdate(row)}/>
                    { !disableEdit && <i className="pi pi-trash" style={{color: "var(--red-600)", cursor: "pointer"}} onClick={() =>  onClickDelete(row.id)}/>  }
                </div>
            }}/>
        </DataTable>
    </div>
}

export default TableMovimientos;