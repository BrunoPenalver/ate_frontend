import { SelectButton } from "primereact/selectbutton";
import { ContainerInput, Dropzone, FirstRow, Form, SecondRow } from "../../../../styles/admin/ordenes/agregar/crearMovimiento";
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
import Beneficiary from "../../../../interfaces/orders/beneficiary";
import PaymentType from "../../../../interfaces/orders/paymenttype";
import { AttachmentsContainer } from "../../../../styles/admin/ordenes/agregar/Movimiento/Attachment";

const Types = [ "Debe", "Haber" ];


const getInitialValue = () =>
{
    return {
        tempId: Date.now(),
        type: Types[0],
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
        paymentType: movement.paymentType,
        beneficiary: movement.beneficiary,
        amount: movement.amount,
        concept: movement.concept,
        sectional: movement.sectional,
        origin: movement.account,
        originBank: movement.bankAccount,
        paymentDate: movement.paymentDate,
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

    const requireds = ["amount","concept","account","beneficiary","paymentType","bankAccount","paymentDate","sectional"];

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
    const [Beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
    const [PaymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);

  
    useEffect(() => 
    {
        const getData = async () =>
        {
            try 
            {
                const { data: sectionals } = await api.get<Sectional[]>("/sectionalnames");
                const { data: concepts } = await api.get<Concept[]>("/concepts");

                const { data: beneficiaries } = await api.get<Beneficiary[]>("/beneficiaries");
                const { data: accounts } = await api.get<Account[]>("/accounts");

                const { data: paymenttypes } = await api.get<PaymentType[]>("/paymenttypes");
                
                setSectionals(sectionals);
                setConcepts(concepts);
                setAccounts(accounts);
                setBeneficiaries(beneficiaries);    
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

    const AttachmentsSorted = useMemo(() => FormMovimiento.values.attachments.sort((a:AttachmentType,b:AttachmentType) => b.file.name.localeCompare(a.file.name)),[FormMovimiento.values.attachments]);


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

    // Beneficiario 

    const [FilteredBeneficiaries, setFilteredBeneficiaries] = useState<Beneficiary[]>(Beneficiaries);

    const searchMethodBeneficiaries = (event:AutoCompleteCompleteEvent) =>
    {
        const { query } = event;

        if(query.trim() === "")
            setFilteredBeneficiaries(Beneficiaries);

        const inputSearch = query.trim().toLowerCase();

        const filteredBeneficiaries = Beneficiaries.filter(beneficiary => 
        {
            const textSearchObject = `${beneficiary.code} - ${beneficiary.businessName}`.toLowerCase();
            return textSearchObject.includes(inputSearch);
        });

        setFilteredBeneficiaries(filteredBeneficiaries);
    }

    const templateOptionBeneficiary = (beneficiary: Beneficiary) =>
    {
        return <p>{beneficiary.code} - {beneficiary.businessName}</p>
    }

    const onChangeBeneficiary = (event:AutoCompleteChangeEvent) =>
    {
        const { value } = event;
        FormMovimiento.setFieldValue("beneficiary",value);

        if (typeof value === "string" || value === null)
        {
            FormMovimiento.setFieldValue("beneficiaryCuit",null);
            return;
        }

        const { bankAccounts , cuit } = value as Beneficiary;
        
        FormMovimiento.setFieldValue("originBanks",bankAccounts);
        FormMovimiento.setFieldValue("beneficiaryCuit",cuit);
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
        return <p>{account.code} - {account.number} - {account.name}</p>
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

    const templateOptionOriginBank = (bankAccount: BankAccount) =>
    {
        return <p>{bankAccount.CBU} - {bankAccount.bank}</p>
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

        const { number , CBU } = value as BankAccount;
        FormMovimiento.setFieldValue("originBankNumber",number);
        FormMovimiento.setFieldValue("originBankCBU",CBU);
    }

    ////
   
    const onsubmit = (values: any) =>
    {
        const newMovimiento: Movement =
        {
            tempId: values.tempId,
            type: values.type,
            amount: values.amount,
            beneficiary: values.beneficiary,
            concept: values.concept,
            sectional: values.sectional,
            account: values.account,
            bankAccount: values.bankAccount,
            paymentDate: values.paymentDate,
            holder: values.holder,
            operation: values.operation,
            paymentType: values.paymentType,
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

    const removeFile = (id: string) =>
    {
        const oldAttachments: AttachmentType[] = FormMovimiento.values.attachments;
        const newAttachments = oldAttachments.filter(attachment => attachment.id !== id);
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
                    <AutoComplete dropdown forceSelection id="origin" value={FormMovimiento.values.account} suggestions={FilteredOrigins} 
                    completeMethod={searchMethodOrigins} itemTemplate={templateOptionLedgerAccount} field="name" onChange={onChangeOrigin}/>
                    <label htmlFor="account">Cuenta Contable</label>
                </FloatLabel>
                {getFormErrorMessage("account")}
            </ContainerInput>

            <ContainerInput>
                <FloatLabel>
                    <AutoComplete dropdown forceSelection id="beneficiary" value={FormMovimiento.values.beneficiary} field="businessName" suggestions={FilteredBeneficiaries}
                    completeMethod={searchMethodBeneficiaries} itemTemplate={templateOptionBeneficiary} onChange={onChangeBeneficiary}/>
                    <label htmlFor="beneficiary">Beneficiario a cobrar</label>
                </FloatLabel>
                {getFormErrorMessage("beneficiary")}
            </ContainerInput>
        </SecondRow>

        <SecondRow>
            <ContainerInput>
                <FloatLabel>
                    <AutoComplete dropdown forceSelection id="paymentType" value={FormMovimiento.values.paymentType} field="type" suggestions={FilteredPaymentTypes}
                    completeMethod={searchMethodPaymentTypes}  onChange={onChangePaymentType} itemTemplate={templateOptionPaymentTypes}/>
                    <label htmlFor="paymentType">Metodo de Pago</label>
                </FloatLabel>
                {getFormErrorMessage("paymentType")}
            </ContainerInput>
            <ContainerInput>
                <FloatLabel>
                    <AutoComplete emptyMessage="El beneficiario no tiene bancos" dropdown forceSelection id="bankAccount" value={FormMovimiento.values.bankAccount} field="bank" suggestions={FilteredOriginBanks}
                    completeMethod={searchMethodBankAccount} itemTemplate={templateOptionOriginBank}  onChange={onChangeOriginBank}/>
                    <label htmlFor="bankAccount">Banco</label>
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
                    <InputText id="operation" value={FormMovimiento.values.operation} onChange={e => FormMovimiento.setFieldValue("operation",e.target.value)}/>
                    <label htmlFor="operation">Operación</label>
                </FloatLabel>
            </ContainerInput>
        </SecondRow>

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
                    <InputText id="holder" value={FormMovimiento.values.holder} onChange={e => FormMovimiento.setFieldValue("holder",e.target.value)}/>
                    <label htmlFor="holder">Titular</label>
                </FloatLabel>
            </ContainerInput>
        </SecondRow>

        <SecondRow>
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
        </SecondRow>

        <Dropzone  multiple id="imageUpload" onDrop={onDrop}  type="file" onChange={onSelectFile} value={""}  accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,image/jpeg,image/png,image/jpg"></Dropzone>
        <AttachmentsContainer>
            {AttachmentsSorted.map((attachment:AttachmentType) => <Attachment attachment={attachment} key={attachment.id} removeFile={removeFile}/>)}
        </AttachmentsContainer>
        <div>
            <Button label={props.defaultValue === null ? 'Agregar' : 'Actualizar' } type="submit" id="button_add"/>
            <Button label="Limpiar" type="button" text onClick={cleanForm}/>
        </div>
    </Form>
}

export default CreateOrUpdateMovimiento;