import { useMemo, useState } from "react";
import { FloatLabel } from "primereact/floatlabel";
import { Calendar } from "primereact/calendar";
import { FormikValues, useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import CreateOrUpdateMovimiento from "./Movimiento";
import Movimiento from "./Movimiento";
import Movement from "../../../interfaces/orders/movement";
import TableMovimientos from "./Table";
import { formatPrice } from "../../../utils/prices";
import { Button } from "primereact/button";
import api from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createAlert } from "../../../stores/alerts.slicer";
import { ContainerInput } from "../../../styles/admin/ordenes/movimiento/crear";
import { AddText, ContainerInfo, ContainerTables, Panel, PanelContent, PanelHeader } from "../../../styles/admin/ordenes";
import "../../../styles/admin/ordenes/movimiento/createUpdate.css"
interface Props
{
    type: "add" | "edit";
    values?: {
        id: number,
        date: string,
        description: string,
        state: string,
        movements: any[]
    };
}

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

const Order = (props: Props) =>
{
    const [isLoading, setIsLoading] = useState(false);

    const generateInitialValues = (): FormikValues =>
    {
        if(props.type === "edit" && props.values)
            return { ...props.values, date: new Date(props.values.date) };
        
        return {
            date: new Date(), //TODO: Preguntar si ponemos la fecha actual por defecto
            description: "",
            state: options_state[0],
            movements: []
        }
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const create = async (values:any) =>
    {
        const Payload = new FormData();
        
        Payload.append("date", values.date);
        Payload.append("description", values.description);
        Payload.append("state", values.state);
        
        try 
        {
            for (let index = 0; index < Movimientos.length; index++) 
            {
                const movimiento = Movimientos[index];
        
                Payload.append(`movements[${index}][type]`, movimiento.type);
                Payload.append(`movements[${index}][description]`, movimiento.description);
                Payload.append(`movements[${index}][amount]`, movimiento.amount.toString());
                Payload.append(`movements[${index}][conceptId]`, movimiento.concept.id.toString());
                Payload.append(`movements[${index}][sectionalId]`, movimiento.sectional.id.toString());
                Payload.append(`movements[${index}][accountId]`, movimiento.account.id.toString());
                Payload.append(`movements[${index}][beneficiaryId]`, movimiento.beneficiary.id.toString());
                Payload.append(`movements[${index}][bankAccountId]`, movimiento.bankAccount.id.toString());
                Payload.append(`movements[${index}][paymentTypeId]`, movimiento.paymentType.id.toString());
                Payload.append(`movements[${index}][holder]`, movimiento.holder);
                Payload.append(`movements[${index}][operation]`, movimiento.operation);
                Payload.append(`movements[${index}][details]`, movimiento.details);
        
                movimiento.attachments.forEach((attachment, attachmentIndex) => {
                Payload.append(`movements[${index}][attachments][${attachmentIndex}]`, attachment.file);
                });
            }

            await api.post("/orders", Payload, { headers: { "Content-Type": "multipart/form-data" } });
            
            dispatch(createAlert({ severity: "success", summary: "Orden creada", detail: `La orden fue creada correctamente`}));
        
            setTimeout(() => navigate("/admin/ordenes"), 250);
        } 
        catch (error: any) 
        {
            console.log(error);
            dispatch(createAlert({ severity: "error", summary: "Error al crear la orden", detail: error.response.data.message || "Error al crear la orden" }));
        }
    }

    const update = async (values:any) =>
    {
        if(!props.values)
            return;

        const Payload = new FormData();
        
        Payload.append("date", values.date);
        Payload.append("description", values.description);
        Payload.append("state", values.state);
        
        try 
        {
            for (let index = 0; index < Movimientos.length; index++) 
            {
                const movimiento = Movimientos[index];
            
                Payload.append(`movements[${index}][id]`, movimiento.id.toString());
                Payload.append(`movements[${index}][type]`, movimiento.type);
                Payload.append(`movements[${index}][description]`, movimiento.description);
                Payload.append(`movements[${index}][amount]`, movimiento.amount.toString());
                Payload.append(`movements[${index}][conceptId]`, movimiento.concept.id.toString());
                Payload.append(`movements[${index}][sectionalId]`, movimiento.sectional.id.toString());
                Payload.append(`movements[${index}][accountId]`, movimiento.account.id.toString());
                Payload.append(`movements[${index}][beneficiaryId]`, movimiento.beneficiary.id.toString());
                Payload.append(`movements[${index}][bankAccountId]`, movimiento.bankAccount.id.toString());
                Payload.append(`movements[${index}][paymentTypeId]`, movimiento.paymentType.id.toString());
                Payload.append(`movements[${index}][holder]`, movimiento.holder);
                Payload.append(`movements[${index}][operation]`, movimiento.operation);
                Payload.append(`movements[${index}][details]`, movimiento.details);
        
                movimiento.attachments.forEach((attachment, attachmentIndex) => 
                {
                    if(typeof attachment === "string")
                        Payload.append(`movements[${index}][attachments][${attachmentIndex}]`, attachment);
                    else
                        Payload.append(`movements[${index}][attachments][${attachmentIndex}]`, attachment.file);
                });
            }

            await api.put(`/orders/${props.values.id}`, Payload, { headers: { "Content-Type": "multipart/form-data" } });
            
            dispatch(createAlert({ severity: "success", summary: "Orden actualizada", detail: `La orden fue actualizada correctamente`}));
        
            setTimeout(() => navigate("/admin/ordenes"), 250);
        } 
        catch (error: any) 
        {
            console.log(error);
            dispatch(createAlert({ severity: "error", summary: "Error al actualizar la orden", detail: error.response.data.message || "Error al actualizar la orden" }));
        }
    }

    const onSubmit = async (values: any) => 
    {
        setIsLoading(true);

        const isValidTotals = TotalDebe === TotalHaber;

        if(!isValidTotals && values.state === "Cerrada")
        {
            dispatch(createAlert({ severity: "error", summary: "Error al guardar la orden", detail: "Los totales de los movimientos no coinciden" }));
            setIsLoading(false);
            return;
        }

        props.type === "add" ? await create(values) : await update(values);
        
        setIsLoading(false);
    };

    const Form = useFormik<FormikValues>({
        initialValues: generateInitialValues(),
        onSubmit,
        validate: getErrors
    });


    const [Movimientos, setMovimientos] = useState<Movement[]>(Form.values.movements);

    /* Dialogs */ 

    const [ShowAdd, setShowAdd] = useState(false);
    const switchShowAdd = () => setShowAdd(!ShowAdd);

    const [ShowUpdate, setShowUpdate] = useState(false);
    const switchShowUpdate = () => setShowUpdate(!ShowUpdate);

    const callBackDialogAdd = (movimiento: Movement) => 
    {
        setMovimientos([...Movimientos, movimiento]);
        switchShowAdd();
    }

    const callBackDialogUpdate = (movimiento: Movement) =>
    {
        setMovimientos(prev => prev.map(mov => mov.id === movimiento.id ? movimiento : mov));
        switchShowUpdate();
    }

    /* Movimientos */

    const [SelectedToUpdate, setSelectedToUpdate] = useState<Movement | null>(null);

    const TypesDebe =  useMemo(() => Movimientos.filter(movimiento => movimiento.type === "Debe"   ), [ Movimientos ] );
    const TypesHaber = useMemo(() => Movimientos.filter(movimiento => movimiento.type === "Haber" ),  [ Movimientos ] );


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
        
        const error = findError(Form.errors, key.split('.'));
        const touched = findError(Form.touched, key.split('.'));
    
        return error && touched ? <small className="p-error">{error}</small> : <></>;
    };

    const deleteMovement = (movementId: number) => setMovimientos(prev => prev.filter(movimiento => movimiento.id !== movementId));
    const updateMovement = (toUpdate: Movement) =>
    {
        setSelectedToUpdate(toUpdate);
        switchShowUpdate();
    }

    /* Totalizadores */
    
    const TotalHaber = useMemo( () => TypesHaber.reduce((acc, movimiento) => acc + movimiento.amount, 0), [ TypesHaber ] );
    const TotalDebe = useMemo( () => TypesDebe.reduce((acc, movimiento) => acc + movimiento.amount, 0), [ TypesDebe ] );

    const Saldo = useMemo( () => TotalDebe - TotalHaber, [ TotalDebe, TotalHaber ] );

    return <form onSubmit={Form.handleSubmit}>
        <PanelHeader>
            <PanelContent>
                <ContainerInput>
                    <FloatLabel>  
                        <Calendar id="date" dateFormat="dd/mm/yy" locale="es" value={Form.values.date} onChange={e => Form.setFieldValue("date",e.value)} />
                        <label htmlFor="date">Fecha</label>    
                    </FloatLabel>  
                    {getFormErrorMessage("date")}
                </ContainerInput>
                <ContainerInput>
                    <FloatLabel>  
                        <InputText id="description" value={Form.values.description} onChange={e => Form.setFieldValue("description",e.target.value)}/>
                        <label htmlFor="description">Descripción</label>    
                    </FloatLabel>  
                    {getFormErrorMessage("description")}
                </ContainerInput>
                <ContainerInput>
                    <FloatLabel>  
                        <Dropdown id="state" options={options_state} value={Form.values.state} onChange={e => Form.setFieldValue("state",e.target.value)}/>
                        <label htmlFor="state">Estado</label>    
                    </FloatLabel>  
                    {getFormErrorMessage("state")}
                </ContainerInput>
            </PanelContent>
        </PanelHeader>

        <AddText id="add-text" onClick={switchShowAdd}>Ingresar movimiento</AddText>

        <Dialog onHide={switchShowAdd} header="Agregar movimiento" visible={ShowAdd} style={{maxWidth: "80vw",padding: '0 !imporant;'}}>
            <CreateOrUpdateMovimiento callBackDialogAdd={callBackDialogAdd} defaultValue={null} callBackUpdate={callBackDialogUpdate}/>
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

        <Dialog visible={ShowUpdate} header="Actualizar movimiento" onHide={switchShowUpdate} style={{maxWidth: "80vw"}}>
            <Movimiento callBackDialogAdd={callBackDialogAdd} defaultValue={SelectedToUpdate} callBackUpdate={callBackDialogUpdate}/>
        </Dialog>


        {props.type === "add"  && <Button disabled={isLoading} label="Guardar"    id="save-order" className="p-button-success" type="submit"/>}
        {props.type === "edit" && <Button disabled={isLoading} label="Actualizar" id="edit-order" className="p-button-success" type="submit"/>}
    </form>
}

export default Order;