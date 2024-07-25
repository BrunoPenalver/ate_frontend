import { SelectButton } from "primereact/selectbutton";
import { ContainerInput, Dropzone, FirstRow, Form, FourthRow, SecondRow, ThridRow } from "../../../../styles/admin/ordenes/agregar/crearMovimiento";
import { FloatLabel } from "primereact/floatlabel";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from 'primereact/inputtextarea';
import { useFormik } from "formik";
import { AutoComplete, AutoCompleteChangeEvent, AutoCompleteCompleteEvent } from "primereact/autocomplete";
import { useEffect, useMemo, useState } from "react";
import Concept from "../../../../interfaces/orders/concept";
import Sectional from "../../../../interfaces/orders/sectional";
import { useDispatch } from "react-redux";
import { createAlert } from "../../../../stores/alerts.slicer";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import Movement, { Attachment as AttachmentType } from "../../../../interfaces/orders/movement";
import api from "../../../../utils/api";
import Loading from "../../../Loading";
import Account from "../../../../interfaces/orders/account";
import BankAccount from "../../../../interfaces/orders/bankAccount";
import Attachment from "./Attachment";

const States = [ "Abierta !", "Cerrada !" ];
const Types = [ "Debe", "Haber" ];
const Periods = [ 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016,2017 ,2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

const getInitialValue = () =>
{
    return {
        tempId: Date.now(),
        period: Periods[0],
        type: Types[0],
        state: States[0],
        amount: null,
        concept: null,
        sectional: null,
        origin: null,
        originBank:
        {
            bank: "",
            holder: "",
            number: "",
            type: "",
            CBU: "",
            alias: "",
            cuit: "",
            createdAt: "",
            updatedAt: ""
        },
        destiny:null,
        destinyBank: 
        {
            bank: "",
            holder: "",
            number: "",
            type: "",
            CBU: "",
            alias: "",
            cuit: "",
            createdAt: "",
            updatedAt: ""
        
        },
        destinyBankAccount: undefined,
        destinyBankCBU: undefined,
        paymentDate: null,
        details: "",
        attachments:[]
    }
}

const generateFromDefaultValue = (movement: Movement) =>
{
    return {
        tempId: movement.tempId,
        type: movement.type,
        amount: movement.amount,
        concept: movement.concept,
        sectional: movement.sectional,
        origin: movement.origin,
        originBank: movement.origin.bankAccount,
        destinyBank: movement.destiny.bankAccount,
        destiny:movement.destiny,
        paymentDate: movement.paymentDate,
        details: movement.details,
        attachments: movement.attachments
    }
}

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

    const requireds = ["amount","concept","sectional","origin","originBank","destiny","destinyBank","paymentDate","details"];

    requireds.forEach(required => 
    {
        if(!values[required] || values[required] === "" || values[required] === null || values[required] === undefined)
            errors[required] = "Campo requerido"
    });
    
    
    return formatJsonError(errors);
}

interface Props
{
    callBackDialogAdd: (newMovimiento: Movement) => void;
    defaultValue: Movement | null;
    callBackUpdate: (toUpdate: Movement) => void;
}

const CreateOrUpdateMovimiento = (props: Props) => 
{
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);

    const [Sectionals, setSectionals] = useState<Sectional[]>([]);
    const [Concepts, setConcepts] = useState<Concept[]>([]);
    const [Accounts, setAccounts] = useState<Account[]>([]);

    useEffect(() => 
    {
        const getData = async () =>
        {
            try 
            {
                const { data: sectionals } = await api.get<Sectional[]>("/sectionalnames");
                const { data: concepts } = await api.get<Concept[]>("/concepts");

                const { data: accounts } = await api.get<Account[]>("/accounts");
                
                setSectionals(sectionals);
                setConcepts(concepts);
                setAccounts(accounts);
            } 
            catch (error) 
            {
                dispatch(createAlert({severity: "error", summary: "Error", detail: "No se pudo cargar la información"}))
            }
            finally
            {
                setIsLoading(false);
            }
        }

        getData();
    }, []);


    const FormMovimiento = useFormik({
        initialValues: getInitialValue(),
        validate: (values) => getErrors(values),
        onSubmit: (values) => onsubmit(values)
    });

    useEffect(() => 
    {
        if(props.defaultValue !== null)
        {
            const toForm = generateFromDefaultValue(props.defaultValue);

            FormMovimiento.setValues(toForm as any);
        }
    },[props.defaultValue]);

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
        
        const error = findError(FormMovimiento.errors, key.split('.'));
        const touched = findError(FormMovimiento.touched, key.split('.'));
    
        return error && touched ? <small className="p-error">{error}</small> : <></>;
    };

    // Conceptos 

    const [FilteredConcepts, setFilteredConcepts] = useState<Concept[]>();

    const searchMethodConcepts = (event:AutoCompleteCompleteEvent) =>
    {
        const { query } = event;

        if(query.trim() === "")
            setFilteredConcepts(Concepts);

        const inputSearch = query.trim().toLowerCase();

        const filteredConcepts = Concepts.filter(concept =>
        {
            const objectText = `${concept.code} - ${concept.description}`.toLowerCase();
            return objectText.includes(inputSearch);
        });
        setFilteredConcepts(filteredConcepts);
    }

    const templateOptionConcepts = (concept: Concept) =>
    {
        return <p>{concept.code} - {concept.description}</p>
    }

    const onChangeConcept = (event:AutoCompleteChangeEvent) =>
    {
        const { value } = event;
        FormMovimiento.setFieldValue("concept",value);
    }

    // Seccional

    const [FilteredSectionals, setFilteredSectionals] = useState<Sectional[]>(Sectionals);

    const searchMethodSectionals = (event:AutoCompleteCompleteEvent) =>
    {
        const { query } = event;

        if(query.trim() === "")
            setFilteredSectionals(Sectionals);

        const filteredSectionals = Sectionals.filter(sectional => sectional.name.toLowerCase().includes(query.toLowerCase()));
        setFilteredSectionals(filteredSectionals);
    }

    const templateOptionSectionals = (sectional: Sectional) =>
    {
        return <p>{sectional.name}</p>
    }

    const onChangeSectional = (event:AutoCompleteChangeEvent) =>
    {
        const { value } = event;
        FormMovimiento.setFieldValue("sectional",value);
    }

    // Beneficiarios: Origen

    const [FilteredOrigins, setFilteredOrigins] = useState<Account[]>(Accounts);

    const searchMethodOrigins = (event:AutoCompleteCompleteEvent) =>
    {
        const { query } = event;

        if(query.trim() === "")
            setFilteredOrigins(Accounts);
    
        
        const inputSearch = query.trim().toLowerCase();

        const filteredOrigins = Accounts.filter(account =>
        {
            const textSearchObject = `${account.code} - ${account.number} - ${account.name}`.toLowerCase();
            return textSearchObject.includes(inputSearch);
        }); 
        setFilteredOrigins(filteredOrigins);
    }

    const templateOptionBeneficiary = (account: Account) =>
    {
        return <p>{account.code} - {account.number} - {account.name}</p>
    }

    const onChangeOrigin = (event:AutoCompleteChangeEvent) =>
    {
        const { value } = event;
        FormMovimiento.setFieldValue("origin",value);

        if(typeof value === "string" || value === null)
            return;

        const { bankAccount } = value as { bankAccount: BankAccount } ;

        FormMovimiento.setFieldValue("originBank",bankAccount);
    }

    // Beneficiarios: Destino

    const [FilteredDestinations, setFilteredDestinations] = useState<Account[]>(Accounts);

    const searchMethodDestinations = (event:AutoCompleteCompleteEvent) =>
    {
        const { query } = event;

        if(query.trim() === "")
            setFilteredDestinations(Accounts);

        const inputSearch = query.trim().toLowerCase();

        const filteredDestinations = Accounts.filter(account => 
        {
            const textSearchObject = `${account.code} - ${account.number} - ${account.name}`.toLowerCase();
            return textSearchObject.includes(inputSearch);
        });

        setFilteredDestinations(filteredDestinations);
    }

    const onChangeDestiny = (event:AutoCompleteChangeEvent) =>
    {
        const { value } = event;
        FormMovimiento.setFieldValue("destiny",value);

        if(typeof value === "string" || value === null)
            return;

        const { bankAccount } = value as { bankAccount: BankAccount } ;

        FormMovimiento.setFieldValue("destinyBank",bankAccount);
    }
   
    const onsubmit = (values: any) =>
    {
        const newMovimiento: Movement =
        {
            tempId: values.tempId,
            type: values.type,
            amount: values.amount,
            concept: values.concept,
            sectional: values.sectional,
            origin: values.origin,
            destiny: values.destiny,
            paymentDate: values.paymentDate,
            details: values.details,
            attachments: values.attachments
        }
        

        if(props.defaultValue !== null)
            props.callBackUpdate(newMovimiento)

        newMovimiento.tempId = Date.now()

        if(props.defaultValue === null)
            props.callBackDialogAdd(newMovimiento);
    }

    const cleanForm = () => FormMovimiento.setValues(getInitialValue());

    if(isLoading)
        return <Loading/>

    const styleForm = useMemo(() => 
    {  
        // const color = FormMovimiento.values.type === "Haber" ? "#f96060" : "#6bc56b"; //TODO: preguntar grado del borde   
        const color = FormMovimiento.values.type === "Haber" ? "red" : "green";

        return { border: `10px solid ${color}`, padding: '1.5rem 2rem', transition: 'border 0.5s' }
    },[FormMovimiento.values.type]);



    const addFiles = (files: FileList) =>
    {
        var oldAttachments: AttachmentType[] = FormMovimiento.values.attachments;

        for (let i = 0; i < files.length; i++) 
        {
            const attachment: AttachmentType = { id: Date.now(), file: files[i] };
            oldAttachments.push(attachment);;
        }
        
        FormMovimiento.setFieldValue("attachments",oldAttachments);
    }

    const onDrop = (event: React.DragEvent<HTMLDivElement>) =>
    {
        event.preventDefault();
        addFiles(event.dataTransfer.files);
    }
    
    const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) =>
    {
        event.preventDefault();
        if(event.target.files)
            addFiles(event.target.files);
    }


    return <Form onSubmit={FormMovimiento.handleSubmit} style={styleForm}>    
        <FirstRow>
                <SelectButton id="select-type" value={FormMovimiento.values.type} onChange={(e) => FormMovimiento.setFieldValue("type",e.target.value)} options={Types}/>     
            <ContainerInput>
                <FloatLabel>
                    <InputNumber id="amount" locale="es" value={FormMovimiento.values.amount} onChange={e => FormMovimiento.setFieldValue("amount",e.value)} />
                    <label htmlFor="amount">Importe</label>    
                </FloatLabel>  
                {getFormErrorMessage("amount")}
            </ContainerInput>
            <ContainerInput>
                <FloatLabel>
                    <AutoComplete id="concept" value={FormMovimiento.values.concept} dropdown forceSelection suggestions={FilteredConcepts} 
                    completeMethod={searchMethodConcepts} itemTemplate={templateOptionConcepts} field="description" onChange={onChangeConcept}/>
                    <label htmlFor="concept">Concepto</label>
                </FloatLabel>
                {getFormErrorMessage("concept")}
            </ContainerInput>
        </FirstRow>

        <SecondRow>
            <ContainerInput>
                <FloatLabel>
                    <AutoComplete id="sectional" value={FormMovimiento.values.sectional} dropdown forceSelection suggestions={FilteredSectionals} 
                    completeMethod={searchMethodSectionals} itemTemplate={templateOptionSectionals} field="name" onChange={onChangeSectional}/>
                    <label htmlFor="sectional">Seccional</label>
                </FloatLabel>
                {getFormErrorMessage("sectional")}
            </ContainerInput>
            <ContainerInput>
                <FloatLabel>
                    <AutoComplete dropdown forceSelection id="origin" value={FormMovimiento.values.origin} suggestions={FilteredOrigins} 
                    completeMethod={searchMethodOrigins} itemTemplate={templateOptionBeneficiary} field="name" onChange={onChangeOrigin}/>
                    <label htmlFor="origin">Subcuenta</label>
                </FloatLabel>
                {getFormErrorMessage("origin")}
            </ContainerInput>
        </SecondRow>

        <SecondRow>
            <ContainerInput>
                <FloatLabel>
                    <InputText id="originBank" value={FormMovimiento.values.originBank.bank} disabled/> 
                    <label htmlFor="originBank">Banco</label>
                </FloatLabel>
                {getFormErrorMessage("originBank")}
            </ContainerInput>
            <ContainerInput>
                <FloatLabel>
                    <AutoComplete dropdown forceSelection id="destiny" value={FormMovimiento.values.destiny} field="name" suggestions={FilteredDestinations}
                    completeMethod={searchMethodDestinations} itemTemplate={templateOptionBeneficiary} onChange={onChangeDestiny}/>
                    <label htmlFor="destiny">Beneficiario a cobrar</label>
                </FloatLabel>
                {getFormErrorMessage("destiny")}
            </ContainerInput>
        </SecondRow>
        
        <ThridRow>
                <ContainerInput>
                <FloatLabel>
                    <InputText id="destinyBanks" disabled value={FormMovimiento.values.destinyBank.bank}/>
                    <label htmlFor="destinyBanks">Banco</label>
                </FloatLabel>
            </ContainerInput>
            <ContainerInput>
                <FloatLabel>
                    <InputText id="destinyNumberAccount" disabled value={FormMovimiento.values.destinyBank.number}/>
                    <label htmlFor="destinyNumberAccount">Nro. de Cuenta</label>
                </FloatLabel>
            </ContainerInput>
            <ContainerInput>
                <FloatLabel>
                    <InputText placeholder="C.B.U" id="destinyCBU" disabled value={FormMovimiento.values.destinyBank.CBU}/>
                    <label htmlFor="destinyCBU">C.B.U</label>
                </FloatLabel>
            </ContainerInput>
        </ThridRow>

        <FourthRow>
            <ContainerInput>
                <FloatLabel>
                    <Calendar id="paymentDate" placeholder="Fecha de cobro" value={FormMovimiento.values.paymentDate} onChange={e => FormMovimiento.setFieldValue("paymentDate",e.target.value)}  dateFormat="dd/mm/yy"/>
                    <label htmlFor="paymentDate">Fecha de cobro</label>
                </FloatLabel>
                {getFormErrorMessage("paymentDate")}
            </ContainerInput>

            <ContainerInput>
                <FloatLabel>
                    <InputTextarea id="details"  rows={3} value={FormMovimiento.values.details} onChange={e => FormMovimiento.setFieldValue("details",e.target.value)}/>
                    <label htmlFor="details">Detalles</label>
                </FloatLabel>
                {getFormErrorMessage("details")}
            </ContainerInput> 
        </FourthRow>

        <Dropzone id="imageUpload" onDrop={onDrop}  type="file" onChange={onSelectFile} value={""}  accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,image/jpeg,image/png,image/jpg"></Dropzone>
        <div>
            {FormMovimiento.values.attachments.map((attachment:AttachmentType) => <Attachment attachment={attachment} key={attachment.id}/>)}
        </div>
        <div>
            <Button label={props.defaultValue === null ? 'Agregar' : 'Actualizar' } type="submit" id="button_add"/>
            <Button label="Limpiar" type="button" text onClick={cleanForm}/>
        </div>
    </Form>
}

export default CreateOrUpdateMovimiento;