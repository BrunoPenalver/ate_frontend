import { SelectButton } from "primereact/selectbutton";
import { ContainerInput, Dropzone, FirstRow, Form, SecondRow } from "../../../styles/admin/ordenes/movimiento/crear";
import { FloatLabel } from "primereact/floatlabel";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from 'primereact/inputtextarea';
import { useFormik } from "formik";
import { AutoComplete, AutoCompleteChangeEvent, AutoCompleteCompleteEvent } from "primereact/autocomplete";
import { useEffect, useMemo, useState } from "react";
import Concept from "../../../interfaces/orders/concept";
import Sectional from "../../../interfaces/orders/sectional";
import { useDispatch } from "react-redux";
import { createAlert } from "../../../stores/alerts.slicer";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import Movement, { Attachment as AttachmentType } from "../../../interfaces/orders/movement";
import api from "../../../utils/api";
import Loading from "../../Loading";
import Account from "../../../interfaces/orders/account";
import BankAccount from "../../../interfaces/orders/bankAccount";
import Attachment from "./Attachment";
import Beneficiary from "../../../interfaces/orders/beneficiary";
import PaymentType from "../../../interfaces/orders/paymenttype";
import { AttachmentsContainer } from "../../../styles/admin/ordenes/movimiento/attachment";

const Types = [ "Debe", "Haber" ];


const getInitialValue = () =>
{
    return {
        tempId: Date.now(),
        type: Types[0],
        description: "",
        paymentType: null,
        amount: null,
        concept: null,
        sectional: null,
        account: null,
        beneficiary: null,
        beneficiaryCuit: "",
        originBanks: [],
        operation: "",
        holder: "",
        bankAccount: null,
        originBankNumber: "",
        originBankCBU: "",
        details: "",
        attachments:[]
    }
}

const generateFromDefaultValue = (movement: Movement) =>
{
    return {
        id: movement.id,
        description: movement.description,
        type: movement.type,
        paymentType: movement.paymentType,
        beneficiary: movement.beneficiary,
        amount: movement.amount,
        concept: movement.concept,
        sectional: movement.sectional,
        origin: movement.account,
        originBank: movement.bankAccount,
        details: movement.details,
        attachments: movement.attachments,
        operation: movement.operation,
        holder: movement.holder,
        account: movement.account,
        beneficiaryCuit: movement.beneficiary.cuit,
        originBanks: movement.beneficiary.bankAccounts,
        bankAccount: movement.bankAccount,
        originBankNumber:  movement.bankAccount.number,
        originBankCBU: movement.bankAccount.CBU,
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

    const requireds = ["amount","concept","account","beneficiary","paymentType","bankAccount","sectional"];

    requireds.forEach(required => 
    {
        if(!values[required] || values[required] === "" || values[required] === null || values[required] === undefined)
            errors[required] = "Campo requerido"
    });
    
    return formatJsonError(errors);
}

interface Props
{
    disabled: boolean;
    callBackDialogAdd: (newMovimiento: Movement) => void;
    defaultValue: Movement | null;
    callBackUpdate: (toUpdate: Movement) => void;
}

const CreateOrUpdateMovimiento = (props: Props) => 
{
    const { disabled } = props;
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);

    const [Accounts, setAccounts] = useState<Account[]>([]);
    const [PaymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);

    useEffect(() => 
    {
        const getData = async () =>
        {
            try 
            {
                const { data: accounts } = await api.get("/accounts");
                const { data: paymenttypes } = await api.get<PaymentType[]>("/paymenttypes");
                
                setAccounts(accounts.rows as Account[]);
                setPaymentTypes(paymenttypes); 
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

    const AttachmentsSorted = useMemo(() =>
    {
        return FormMovimiento.values.attachments.sort((a:AttachmentType | string,b:AttachmentType | string) =>
        {
            const aIsFile =  typeof	a !== "string"
            const bIsFile =  typeof	b !== "string"

            if(aIsFile && bIsFile)
                b.file.name.localeCompare(a.file.name)

            if(!aIsFile && bIsFile)
                b.file.name.localeCompare(a);

            if(aIsFile && !bIsFile)
                b.localeCompare(a.file.name);

            return 0;
        })
    },[FormMovimiento.values.attachments]);


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

    // Tipo de pago

    const [FilteredPaymentTypes, setFilteredPaymentTypes] = useState<PaymentType[]>(PaymentTypes);

    const searchMethodPaymentTypes = (event:AutoCompleteCompleteEvent) =>
    {
        const { query } = event;

        if(query.trim() === "")
            setFilteredPaymentTypes(PaymentTypes);

        const filteredPaymentTypes = PaymentTypes.filter((paymentType:PaymentType) => paymentType.type.toLowerCase().includes(query.toLowerCase()));
        setFilteredPaymentTypes(filteredPaymentTypes);
    }

    const templateOptionPaymentTypes = (paymentType: PaymentType) =>
    {
        return <p>{paymentType.type}</p>
    }

    const onChangePaymentType = (event:AutoCompleteChangeEvent) =>
    {
        const { value } = event;
        FormMovimiento.setFieldValue("paymentType",value);
    }

    // Conceptos 

    const [FilteredConcepts, setFilteredConcepts] = useState<Concept[]>();

    const searchMethodConcepts = async (event:AutoCompleteCompleteEvent) =>
    {
        const { query } = event;

        if(query.trim().length < 3)
            return setFilteredConcepts([]);

        const inputSearch = query.trim().toLowerCase();

        try 
        {
            const { data: concepts } = await api.get(`/concepts?search=${inputSearch}`);
            setFilteredConcepts(concepts.rows as Concept[]);    
        } 
        catch (error) 
        {
            dispatch(createAlert({severity: "error", summary: "Error", detail: "No se pudo cargar los conceptos"}))
            setFilteredConcepts([]);
        }
    }

    const templateOptionConcepts = (concept: Concept) => `${concept.id} - ${concept.code} - ${concept.description}`

    const onChangeConcept = (event:AutoCompleteChangeEvent) =>
    {
        const { value } = event;
        
        if(!value)
            return

        FormMovimiento.setFieldValue("concept",value);
    }

    // Seccional

    const [FilteredSectionals, setFilteredSectionals] = useState<Sectional[]>([]);

    const searchMethodSectionals = async (event:AutoCompleteCompleteEvent) =>
    {
        const { query } = event;

        if(query.trim().length < 3)
            return setFilteredSectionals([{"id": 0, "code": "N0", "name": "NINGUNA","description":"", createdAt: "", updatedAt: ""}]);

        const inputSearch = query.trim().toLowerCase();

        try 
        {
            const { data: sectionals } = await api.get<Sectional[]>(`/sectionalnames?search=${inputSearch}`);
            setFilteredSectionals(sectionals);    
        } 
        catch (error) 
        {
            dispatch(createAlert({severity: "error", summary: "Error", detail: "No se pudo cargar las seccionales"}))
            setFilteredSectionals([{"id": 0, "code": "N0", "name": "NINGUNA","description":"", createdAt: "", updatedAt: ""}]);
        }
    }

    const templateOptionSectionals = (sectional: Sectional) => `${sectional.id} - ${sectional.code} - ${sectional.name}`
    
    const onChangeSectional = (event:AutoCompleteChangeEvent) =>
    {
        const { value } = event;

        if(value === null)
            return

        FormMovimiento.setFieldValue("sectional",value);
    }

    // Beneficiario 

    const [FilteredBeneficiaries, setFilteredBeneficiaries] = useState<Beneficiary[]>([]);

    const searchMethodBeneficiaries = async (event:AutoCompleteCompleteEvent) =>
    {
        const { query } = event;

        if(query.trim().length < 3)
            return setFilteredBeneficiaries([]);

        const inputSearch = query.trim().toLowerCase();

        try 
        {
            const { data: beneficiaries } = await api.get(`/beneficiaries?search=${inputSearch}`);
            setFilteredBeneficiaries(beneficiaries.rows as Beneficiary[]);    
        } 
        catch (error) 
        {
            dispatch(createAlert({severity: "error", summary: "Error", detail: "No se pudo cargar los beneficiarios"}))
            setFilteredBeneficiaries([]);
        }
    }

    const templateOptionBeneficiary = (beneficiary: Beneficiary) => `${beneficiary.id} - ${beneficiary.code} - ${beneficiary.businessName}`

    const onChangeBeneficiary = (event:AutoCompleteChangeEvent) =>
    {
        const { value } = event;

        if(!value)
            return

        FormMovimiento.setFieldValue("beneficiary",value);

        if (typeof value === "string" || value === null)
            return FormMovimiento.setFieldValue("beneficiaryCuit",null);
      

        const { bankAccounts , cuit } = value as Beneficiary;

        FormMovimiento.setFieldValue("originBanks",bankAccounts);
        FormMovimiento.setFieldValue("beneficiaryCuit",cuit);
    
        if(bankAccounts.length === 0 && FormMovimiento.values.originBanks !== bankAccounts)
            dispatch(createAlert({severity: "warn", summary: "Advertencia", detail: "El beneficiario no tiene bancos"}))

        FormMovimiento.setFieldValue("bankAccount",null);
        FormMovimiento.setFieldValue("originBankNumber","");
        FormMovimiento.setFieldValue("originBankCBU","");
    }

    // Cuenta contable  : Origen

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

    const templateOptionLedgerAccount = (account: Account) =>
    {
        return `${account.code} - ${account.number} - ${account.name}`
    }

    const onLeaveLedgerAccount = () =>
    {
        if(typeof FormMovimiento.values.account === "string" || FormMovimiento.values.account === null)
            FormMovimiento.setFieldValue("account",null);
    }


    const onChangeOrigin = (event:AutoCompleteChangeEvent) =>
    {
        const { value } = event;
        FormMovimiento.setFieldValue("account",value);

        if(typeof value === "string" || value === null)
            return;
    }

    // Banco de origen

    const [FilteredOriginBanks, setFilteredOriginBanks] = useState<BankAccount[]>([]);

    const searchMethodBankAccount = (event:AutoCompleteCompleteEvent) =>
    {
        const { query } = event;

        if(query.trim() === "")
            setFilteredOriginBanks(FormMovimiento.values.originBanks);

        const inputSearch = query.trim().toLowerCase();

        const filteredOriginBanks = FormMovimiento.values.originBanks.filter((bankAccount:BankAccount) => 
        {
            const textSearchObject = `${bankAccount.CBU} - ${bankAccount.bank}`.toLowerCase();
            return textSearchObject.includes(inputSearch);
        });

        setFilteredOriginBanks(filteredOriginBanks);
    }

    const templateOptionOriginBank = (bankAccount: BankAccount) => `${bankAccount.CBU} - ${bankAccount.bank}`;

    const onLeaveBank = () =>
    {
        if(typeof FormMovimiento.values.bankAccount === "string" || FormMovimiento.values.bankAccount === null)
            FormMovimiento.setFieldValue("bankAccount",null);
    }

    const onChangeOriginBank = (event:AutoCompleteChangeEvent) =>
    {
        const { value } = event;
        FormMovimiento.setFieldValue("bankAccount",value);

        if(typeof value === "string" || value === null)
        {
            FormMovimiento.setFieldValue("originBankNumber","");
            FormMovimiento.setFieldValue("originBankCBU","");
            return;
        }

        const { number , CBU, holder } = value as BankAccount;
        FormMovimiento.setFieldValue("originBankNumber",number);
        FormMovimiento.setFieldValue("originBankCBU",CBU);
        FormMovimiento.values.holder = holder;
    }

    ////
   
    const onsubmit = (values: any) =>
    {
        const newMovimiento: Movement =
        {
            id: props.defaultValue !== null ? props.defaultValue.id :  Date.now(),
            description: values.description,
            type: values.type,
            amount: values.amount,
            beneficiary: values.beneficiary,
            concept: values.concept,
            sectional: values.sectional,
            account: values.account,
            bankAccount: values.bankAccount,
            holder: values.holder,
            operation: values.operation,
            paymentType: values.paymentType,
            details: values.details,
            attachments: values.attachments
        }
        

        if(props.defaultValue !== null)
            props.callBackUpdate(newMovimiento)


        if(props.defaultValue === null)
            props.callBackDialogAdd(newMovimiento);
    }

    const cleanForm = () => FormMovimiento.setValues(getInitialValue());

    if(isLoading)
        return <Loading/>

    const styleForm = useMemo(() => 
    {  
        const color = FormMovimiento.values.type === "Haber" ? "red" : "green";
        return { border: `10px solid ${color}`, padding: '1.5rem 2rem', transition: 'border 0.5s'  }
    },[FormMovimiento.values.type]);



    const addFiles = (files: FileList) =>
    {
        const allowedFormats = [".doc", ".docx", ".xml", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/pdf", "image/jpeg", "image/png", "image/jpg"];
      
        var oldAttachments: AttachmentType[] = FormMovimiento.values.attachments;

        for (let i = 0; i < files.length; i++) 
        {
            const attachmentId = String(Date.now()) + i;

            const attachment: AttachmentType = { id: attachmentId, file: files[i] };

            if(allowedFormats.includes(attachment.file.type))
                oldAttachments.push(attachment)
            else    
            {
                dispatch(createAlert({severity: "error", summary: "Error", detail: "Formato de archivo no permitido"}))
            }
        }
        
        FormMovimiento.setFieldValue("attachments",oldAttachments);
    }

    const removeFile = (indexToDelete: number) =>
    {
        const oldAttachments: AttachmentType[] = FormMovimiento.values.attachments;
        const newAttachments = oldAttachments.filter((_,index) => index !== indexToDelete);
        FormMovimiento.setFieldValue("attachments",newAttachments);
    }

    const onDrop = (event: React.DragEvent<HTMLDivElement>) =>
    {
        event.preventDefault();
        const files = event.dataTransfer.files;
      
        addFiles(files);
    }
    
    const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) =>
    {
        event.preventDefault();
        if(event.target.files)
            addFiles(event.target.files);
    }


    return <Form onSubmit={FormMovimiento.handleSubmit} style={styleForm}>    
        <FirstRow>
            <SelectButton id="select-type" value={FormMovimiento.values.type} onChange={(e) => FormMovimiento.setFieldValue("type",e.target.value)} options={Types} disabled={disabled}/>     
            <ContainerInput>
                <FloatLabel>
                    <InputNumber id="amount" locale="de-DE" minFractionDigits={2} maxFractionDigits={2} value={FormMovimiento.values.amount} onChange={e => FormMovimiento.setFieldValue("amount",e.value)} disabled={disabled}/>
                    <label htmlFor="amount">Importe</label>    
                </FloatLabel>  
                {getFormErrorMessage("amount")}
            </ContainerInput>

            <ContainerInput>
                <FloatLabel>
                    <InputText id="description" value={FormMovimiento.values.description} onChange={e => FormMovimiento.setFieldValue("description",e.target.value)} disabled={disabled}/>
                    <label htmlFor="description">Descripción</label>
                </FloatLabel>
                {getFormErrorMessage("description")}
            </ContainerInput> 


        </FirstRow>

        <ContainerInput>
            <FloatLabel>
                <AutoComplete dropdown id="origin" value={FormMovimiento.values.account} suggestions={FilteredOrigins} onBlur={onLeaveLedgerAccount}
                completeMethod={searchMethodOrigins} itemTemplate={templateOptionLedgerAccount} selectedItemTemplate={templateOptionLedgerAccount} onChange={onChangeOrigin}  disabled={disabled}/>
                <label htmlFor="account">Cuenta Contable (Número - Código Abr - Nombre)</label>
            </FloatLabel>
            {getFormErrorMessage("account")}
        </ContainerInput>


        <ContainerInput>
            <FloatLabel>
                <AutoComplete dropdown id="beneficiary" value={FormMovimiento.values.beneficiary} suggestions={FilteredBeneficiaries} forceSelection
                completeMethod={searchMethodBeneficiaries} itemTemplate={templateOptionBeneficiary} selectedItemTemplate={templateOptionBeneficiary} onChange={onChangeBeneficiary} disabled={disabled}/>
                <label htmlFor="beneficiary">Beneficiario a cobrar (Número - Código - Nombre)</label>
            </FloatLabel>
            {getFormErrorMessage("beneficiary")}
        </ContainerInput>
        
        <SecondRow>
            <ContainerInput>
                <FloatLabel>
                    <AutoComplete dropdown forceSelection id="paymentType" value={FormMovimiento.values.paymentType} field="type" suggestions={FilteredPaymentTypes}
                    completeMethod={searchMethodPaymentTypes}  onChange={onChangePaymentType} itemTemplate={templateOptionPaymentTypes} disabled={disabled}/>
                    <label htmlFor="paymentType">Metodo de Pago</label>
                </FloatLabel>
                {getFormErrorMessage("paymentType")}
            </ContainerInput>
            <ContainerInput>
                <FloatLabel>
                    <AutoComplete emptyMessage="El beneficiario no tiene bancos" dropdown id="bankAccount" value={FormMovimiento.values.bankAccount} onBlur={onLeaveBank}
                    suggestions={FilteredOriginBanks} completeMethod={searchMethodBankAccount} itemTemplate={templateOptionOriginBank} selectedItemTemplate={templateOptionOriginBank}  onChange={onChangeOriginBank} disabled={disabled}/>
                    <label htmlFor="bankAccount">Banco (CBU de beneficiario y banco)</label>
                </FloatLabel>
                {getFormErrorMessage("bankAccount")}
            </ContainerInput>
        </SecondRow>

        <SecondRow>
            <ContainerInput>
                <FloatLabel>
                    <InputText id="beneficiaryCuit" disabled value={FormMovimiento.values.beneficiaryCuit}/>
                    <label htmlFor="beneficiaryCuit">CUIT</label>
                </FloatLabel>
            </ContainerInput>
            <ContainerInput>
                <FloatLabel>
                    <InputText id="operation" value={FormMovimiento.values.operation} onChange={e => FormMovimiento.setFieldValue("operation",e.target.value)} disabled={disabled}/>
                    <label htmlFor="operation">Operación</label>
                </FloatLabel>
            </ContainerInput>
        </SecondRow>

        <SecondRow>
            <ContainerInput>
                <FloatLabel>
                    <AutoComplete id="sectional" value={FormMovimiento.values.sectional} dropdown suggestions={FilteredSectionals} forceSelection  completeMethod={searchMethodSectionals} 
                    itemTemplate={templateOptionSectionals} selectedItemTemplate={templateOptionSectionals} onChange={onChangeSectional} disabled={disabled}/>
                    <label htmlFor="sectional">Seccional (Número - Código - Nombre)</label>
                </FloatLabel>
                {getFormErrorMessage("sectional")}
            </ContainerInput>
            <ContainerInput>
                <FloatLabel>
                    <InputText id="holder" value={FormMovimiento.values.holder} disabled onChange={e => FormMovimiento.setFieldValue("holder",e.target.value)}/>
                    <label htmlFor="holder">Titular</label>
                </FloatLabel>
            </ContainerInput>
        </SecondRow>

        <SecondRow>

            <ContainerInput>
                <FloatLabel>
                    <AutoComplete id="concept" value={FormMovimiento.values.concept} dropdown suggestions={FilteredConcepts} forceSelection
                    completeMethod={searchMethodConcepts} itemTemplate={templateOptionConcepts} selectedItemTemplate={templateOptionConcepts} onChange={onChangeConcept} disabled={disabled}/>
                    <label htmlFor="concept">Concepto (Número - Código - Nombre)</label>
                </FloatLabel>
                {getFormErrorMessage("concept")}
            </ContainerInput>
           
            <ContainerInput>
                <FloatLabel>
                    <InputTextarea id="details"  rows={3} value={FormMovimiento.values.details} onChange={e => FormMovimiento.setFieldValue("details",e.target.value)} disabled={disabled}/>
                    <label htmlFor="details">Detalles</label>
                </FloatLabel>
                {getFormErrorMessage("details")}
            </ContainerInput> 
        </SecondRow>

        {!disabled && <>
            <Dropzone  multiple id="imageUpload" onDrop={onDrop}  type="file" onChange={onSelectFile} value={""}  accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,image/jpeg,image/png,image/jpg"></Dropzone>
            <AttachmentsContainer>
                {AttachmentsSorted.map((attachment:AttachmentType | string,index: number) => <Attachment attachment={attachment} attachmentIndex={index} key={attachment.toString()} removeFile={removeFile}/>)}
            </AttachmentsContainer>
        </>}
        <div>
            <Button label={props.defaultValue === null ? 'Agregar' : 'Actualizar' } disabled={disabled}  type="submit" id="button_add"/>
            <Button label="Limpiar" disabled={disabled} type="button" text onClick={cleanForm}/>
        </div>
    </Form>
}

export default CreateOrUpdateMovimiento;