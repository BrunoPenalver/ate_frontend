
import { useMemo, useState } from "react";
import HeaderLayout  from "../../layouts/Admin"
import Movimiento from "../../components/admin/agregar/Movimiento";
import { Dialog } from "primereact/dialog";
import { AddText, ContainerInfo, ContainerTables, Panel, PanelContent, PanelHeader } from "../../styles/admin/ordenes/agregar";
import TableMovimientos from "../../components/admin/agregar/TableMovimientos";
import Movement from "../../interfaces/orders/movement";
import { ConfirmDialog } from "primereact/confirmdialog";
import { ContainerInput } from "../../styles/admin/ordenes/agregar/crearMovimiento";
import { useFormik } from "formik";
import { FloatLabel } from "primereact/floatlabel";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { formatPrice } from "../../utils/prices";
import { Button } from "primereact/button";
import { createAlert } from "../../stores/alerts.slicer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


const options_state = [ "Abierta", "Cerrada" ];

const getErrors = (values: any) =>
{
    const formatJsonError = (value : any) => 
    {
        const errorJson: { [key: string]: any } = {};
    
        for (const key in value) 
        {
            if (value.hasOwnProperty(key)) 
            {
                const partes = key.split('.');
                let tempObj: { [key: string]: any } = errorJson;
    
                for (let i = 0; i < partes.length - 1; i++) {
                    const parte = partes[i];
                    tempObj[parte] = tempObj[parte] || {};
                    tempObj = tempObj[parte];
                }
    
                tempObj[partes[partes.length - 1]] = value[key];
            }
        }
    
        return errorJson;
    }

    var errors : any = {};

    const requireds = ["date", "description", "state"];

    requireds.forEach(required => 
    {
        if(!values[required] || values[required] === "" || values[required] === null || values[required] === undefined)
            errors[required] = "Campo requerido"
    });
    
    
    return formatJsonError(errors);
}

const getInitialValues = () =>
{
    return {
        date: null, //TODO: Preguntar si ponemos la fecha actual por defecto
        description: "",
        state: options_state[0],
    };
}

const AgregarPage = () => 
{
    const FormAdd = useFormik({
        initialValues: getInitialValues(),
        validate: values => getErrors(values),
        onSubmit: values => handleSubmit(values),
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getFormErrorMessage = (key: string) => 
    {
        const findError = (obj: any, keys: string[]) =>
        {
            return keys.reduce((acc, curr) => {
                if (acc && acc[curr]) {
                    return acc[curr];
                }
                return undefined;
            }, obj);
        };
        
        const error = findError(FormAdd.errors, key.split('.'));
        const touched = findError(FormAdd.touched, key.split('.'));
    
        return error && touched ? <small className="p-error">{error}</small> : <></>;
    };


    const [ShowAdd, setShowAdd] = useState(false);
    const switchShowAdd = () => setShowAdd(!ShowAdd);

    const [ShowUpdate, setShowUpdate] = useState(false);
    const switchShowUpdate = () => setShowUpdate(!ShowUpdate);
    const [SelectedToUpdate, setSelectedToUpdate] = useState<Movement | null>(null);


    const [Movimientos, setMovimientos] = useState<Movement[]>([]);

    const TypesDebe =  useMemo( () => Movimientos.filter(movimiento => movimiento.type === "Debe"   ), [ Movimientos ] );
    const TypesHaber = useMemo( () => Movimientos.filter(movimiento => movimiento.type === "Haber" ), [ Movimientos ] );

    const TotalHaber = useMemo( () => TypesHaber.reduce((acc, movimiento) => acc + movimiento.amount, 0), [ TypesHaber ] );
    const TotalDebe = useMemo( () => TypesDebe.reduce((acc, movimiento) => acc + movimiento.amount, 0), [ TypesDebe ] );

    const Saldo = useMemo( () => TotalDebe - TotalHaber, [ TotalDebe, TotalHaber ] );

    const callBackDialogAdd = (movimiento: Movement) => 
    {
        setMovimientos([...Movimientos, movimiento]);
        switchShowAdd();
    }

    const deleteMovement = (movementId: number) => setMovimientos(prev => prev.filter(movimiento => movimiento.tempId !== movementId));

    const updateMovement = (toUpdate: Movement) =>
    {
        setSelectedToUpdate(toUpdate);
        switchShowUpdate();
    }

    const callBackDialogUpdate = (movimiento: Movement) =>
    {
        setMovimientos(prev => prev.map(mov => mov.tempId === movimiento.tempId ? movimiento : mov));
        switchShowUpdate();
    }

    const handleSubmit = (values:any) =>
    {

        if(Movimientos.length === 0)
        {
            dispatch(createAlert({severity: "error", summary: "Error", detail: `Se debe ingresar al menos un movimiento`}));
        }
        else
        {
            //Tengo que poner else porque si pongo return se rompe el handle submit

            const Payload =  
            {
                date: values.date,
                description: values.description,
                state: values.state,
                movements: Movimientos,
            };

            dispatch(createAlert({severity: "success", summary: "Movimiento creada", detail: `La orden fue creada correctamente`}));
            
            console.log(Payload);
            
            // setTimeout(() =>
            // {
            //     navigate("/ordenes/lista"); 
            // }, 2500);
        }
    }
    
    return <HeaderLayout>
        <form onSubmit={FormAdd.handleSubmit}>
            <PanelHeader>
                <PanelContent>
                    <ContainerInput>
                        <FloatLabel>  
                            <Calendar id="date" dateFormat="dd/mm/yy" value={FormAdd.values.date} onChange={e => FormAdd.setFieldValue("date",e.value)} />
                            <label htmlFor="date">Fecha</label>    
                        </FloatLabel>  
                        {getFormErrorMessage("date")}
                    </ContainerInput>
                    <ContainerInput>
                        <FloatLabel>  
                            <InputText id="description" value={FormAdd.values.description} onChange={e => FormAdd.setFieldValue("description",e.target.value)}/>
                            <label htmlFor="description">Descripción</label>    
                        </FloatLabel>  
                        {getFormErrorMessage("description")}
                    </ContainerInput>
                    <ContainerInput>
                        <FloatLabel>  
                            <Dropdown id="state" options={options_state} value={FormAdd.values.state}/>
                            <label htmlFor="state">Estado</label>    
                        </FloatLabel>  
                        {getFormErrorMessage("state")}
                    </ContainerInput>
                </PanelContent>
             </PanelHeader>

            <AddText id="add-text" onClick={switchShowAdd}>Ingresar movimiento</AddText>

            <Dialog onHide={switchShowAdd} header="Agregar movimiento" visible={ShowAdd} style={{maxWidth: "80vw"}}>
                <Movimiento callBackDialogAdd={callBackDialogAdd} defaultValue={null} callBackUpdate={callBackDialogUpdate}/>
            </Dialog>

            <Panel header={ Movimientos.length === 1 ? '1 Movimiento' : `${Movimientos.length} Movimientos`} toggleable>
                <ContainerTables>
                    <TableMovimientos movimientos={TypesDebe}  title="Debe"  onDelete={movementId => deleteMovement(movementId)} onUpdate={toUpdate => updateMovement(toUpdate)}/>
                    <TableMovimientos movimientos={TypesHaber} title="Haber" onDelete={movementId => deleteMovement(movementId)} onUpdate={toUpdate => updateMovement(toUpdate)}/>
                </ContainerTables>
            </Panel>

            {TotalDebe + TotalHaber > 0 && <Panel header="Saldos">
                <ContainerInfo>
                    <h5>Total deber: ${formatPrice(TotalDebe)}</h5>
                    <h5>Total haber: ${formatPrice(TotalHaber)}</h5>
                    <h5>Saldo: ${formatPrice(Saldo)}</h5>
                </ContainerInfo>
            </Panel>}
        
            <ConfirmDialog/>

            <Dialog visible={ShowUpdate} header="Actualizar movimiento" onHide={switchShowUpdate} style={{maxWidth: "80vw"}}>
                <Movimiento callBackDialogAdd={callBackDialogAdd} defaultValue={SelectedToUpdate} callBackUpdate={callBackDialogUpdate}/>
            </Dialog>

            <Button label="Guardar" id="save-order" className="p-button-success" type="submit"/>
        </form>

    </HeaderLayout>
}

export default AgregarPage