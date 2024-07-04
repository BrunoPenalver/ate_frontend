import { SelectButton } from "primereact/selectbutton";
import { Container5050, ContainerInput, FirstRow, Form, SecondRow, ThridRow } from "../../../styles/admin/ordenes/agregar/crearMovimiento";
import { FloatLabel } from "primereact/floatlabel";
import { InputNumber } from "primereact/inputnumber";
import { useFormik } from "formik";
import { AutoComplete, AutoCompleteChangeEvent, AutoCompleteCompleteEvent } from "primereact/autocomplete";
import { useEffect, useState } from "react";
import Concept from "../../../interfaces/orders/concept";
import Sectional from "../../../interfaces/orders/sectional";
import Beneficiary, { Bank } from "../../../interfaces/orders/beneficiary";
import { useDispatch } from "react-redux";
import { createAlert } from "../../../stores/alerts.slicer";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import Movement from "../../../interfaces/orders/movement";
import api from "../../../utils/api";

const States = [ "Abierta !", "Cerrada !" ];
const Types = [ "Debe", "Haber" ];
const Periods = [ 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016,2017 ,2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

const concepts: Concept[] = 
[
    {id: 1, code: 1 , name: "Concepto 1"},
    {id: 2, code: 2 , name: "Concepto 2"},
];

const sectionals: Sectional[] =
[
    {id: 1, code: 1111 , name: "Seccional 1"},
    {id: 2, code: 2222 , name: "Seccional 2"},
];

const beneficiaries: Beneficiary[] = 
[
    { 
        id: 1,
        code: 1,
        name: "Juan Test",
        cuit: "20-1111111-3",
        banks:
        [
            {
                account: "123456",
                cbu: "123456789",
                id: 1,
                name: "Galicia",
                owner: "Juan Perez"
            }
        ]
    },
    { 
        id: 2,
        code: 2,
        name: "Pedro Test",
        cuit: "20-1111111-3",
        banks:
        [
            {
                account: "11111",
                cbu: "1191919494",
                id: 11,
                name: "Galicia",
                owner: "Juan Perez"
            },
            {
                account: "2222",
                cbu: "11111111119",
                id: 12,
                name: "Banco Nacion",
                owner: "Pedro Test"
            }
        ]
    }
];

const getInitialValue = () =>
{
    return {
        period: Periods[0],
        type: Types[0],
        state: States[0],
        amount: null,
        concept: null,
        sectional: null,
        origin: null,
        originBank:null,
        destiny:null,
        destinyBank: null,
        destinyBankAccount: undefined,
        destinyBankCBU: undefined,
        numberCheck: "",
        paymentDate: null,
        details: "",
        extraDetails: ""
    }
}

const generateFromDefaultValue = (movement: Movement) =>
{
    return {
        period: Periods[0],
        type: movement.type,
        state: States[0],
        amount: String(movement.amount),
        concept: movement.concept,
        sectional: movement.sectional,
        origin: movement.origin,
        originBank: movement.originBank,
        destiny: movement.destiny,
        destinyBank: movement.destinyBank,
        destinyBankAccount: movement.destinyBank.account,
        destinyBankCBU: movement.destinyBank.cbu,
        numberCheck: movement.numberCheck,
        paymentDate: new Date(movement.paymentDate),
        details: movement.details,
        extraDetails: movement.extraDetails
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

    const requireds = ["amount","concept","sectional","origin","originBank","destiny","destinyBank","numberCheck","paymentDate","details"];

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

    useEffect(() => 
    {
        const load = async () =>
        {
            setIsLoading(true);

            try 
            {
                const { data } = await api.get<Concept[]>("/concepts");
                console.log(data)
            } 
            catch (error) 
            {

            }
            finally
            {
                setIsLoading(false);
            }
        }

        load();
    },[]);


    const FormMovimiento = useFormik({
        initialValues: getInitialValue(),
        validate: (values) => getErrors(values),
        onSubmit: (values) => onsubmit(values)
    });


    useEffect(() => 
    {
        if(props.defaultValue !== null)
        {
            console.log("Se actualiza el formulario",props.defaultValue)
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

    const [FilteredConcepts, setFilteredConcepts] = useState<Concept[]>(concepts);

    const searchMethodConcepts = (event:AutoCompleteCompleteEvent) =>
    {
        
        const { query } = event;

        if(query.trim() === "")
            setFilteredConcepts(concepts);

        const filteredConcepts = concepts.filter(concept => concept.name.toLowerCase().includes(query.toLowerCase()));
        setFilteredConcepts(filteredConcepts);
    }

    const templateOptionConcepts = (option: Concept) =>
    {
        return <p>{option.code} {option.name}</p>
    }

    const onChangeConcept = (event:AutoCompleteChangeEvent) =>
    {
        const { value } = event;
        FormMovimiento.setFieldValue("concept",value);
    }

    // Seccional

    const [FilteredSectionals, setFilteredSectionals] = useState<Concept[]>(sectionals);

    const searchMethodSectionals = (event:AutoCompleteCompleteEvent) =>
    {
        const { query } = event;

        if(query.trim() === "")
            setFilteredSectionals(sectionals);

        const filteredSectionals = sectionals.filter(sectional => sectional.name.toLowerCase().includes(query.toLowerCase()));
        setFilteredSectionals(filteredSectionals);
    }

    const templateOptionSectionals = (option: Concept) =>
    {
        return <p>{option.code} {option.name}</p>
    }

    const onChangeSectional = (event:AutoCompleteChangeEvent) =>
    {
        const { value } = event;
        FormMovimiento.setFieldValue("sectional",value);
    }

    // Beneficiarios: Origen

    const [FilteredOrigins, setFilteredOrigins] = useState<Beneficiary[]>(beneficiaries);

    const [FilteredOriginBanks, setFilteredOriginBanks] = useState<Bank[]>([]);
    const [OptionsBanksOrigin, setOptionsBanksOrigin] = useState<Bank[]>([]);

    const searchMethodOrigins = (event:AutoCompleteCompleteEvent) =>
    {
        const { query } = event;

        if(query.trim() === "")
            setFilteredOrigins(beneficiaries);

        const filteredOrigins = beneficiaries.filter(beneficiary => beneficiary.name.toLowerCase().includes(query.toLowerCase()));
        setFilteredOrigins(filteredOrigins);
    }

    const searchMethodOriginBanks = (event:AutoCompleteCompleteEvent) =>
    {
        const { query } = event;

        if(query.trim() === "")
            setFilteredOriginBanks(OptionsBanksOrigin);

        const filteredBanks = FilteredOriginBanks.filter(bank => bank.name.toLowerCase().includes(query.toLowerCase()) || bank.account.toLowerCase().includes(query.toLowerCase()) );
        setFilteredOriginBanks(filteredBanks);
    }

    const templateOptionBeneficiary = (option: Beneficiary) =>
    {
        return <p>{option.code} - {option.name}</p>
    }

    const onChangeOrigin = (event:AutoCompleteChangeEvent) =>
    {
        const { value } = event;
        FormMovimiento.setFieldValue("origin",value);

        if(typeof(value) === "string")
            return

        const { banks } = value as Beneficiary;

        if(banks.length === 0)
            dispatch(createAlert({severity: "error", summary: "Error", detail: `${value.name} no tiene bancos asociados`}))
        else
        {
            FormMovimiento.setFieldValue("originBank",banks[0]);
            setOptionsBanksOrigin(banks);
            setFilteredOriginBanks(banks);
        }
    }

    const onChangeOriginBank = (event:AutoCompleteChangeEvent) =>
    {
        const { value } = event;
        FormMovimiento.setFieldValue("originBank",value);
    }

    // Beneficiarios: Destino

    const [FilteredDestinations, setFilteredDestinations] = useState<Beneficiary[]>(beneficiaries);
    const [FilteredDestinyBanks, setFilteredDestinyBanks] = useState<Bank[]>([]);

    const searchMethodDestinations = (event:AutoCompleteCompleteEvent) =>
    {
        const { query } = event;

        if(query.trim() === "")
            setFilteredDestinations(beneficiaries);

        const filteredDestinations = beneficiaries.filter(beneficiary => beneficiary.name.toLowerCase().includes(query.toLowerCase()));
        setFilteredDestinations(filteredDestinations);
    }

    const searchMethodDestinyBanks = (event:AutoCompleteCompleteEvent) =>
    {
        const { query } = event;

        if(query.trim() === "")
            setFilteredDestinyBanks(OptionsDestinyBanks);

        const filteredBanks = FilteredDestinyBanks.filter(bank => bank.name.toLowerCase().includes(query.toLowerCase()) || bank.account.toLowerCase().includes(query.toLowerCase()) );
        setFilteredDestinyBanks(filteredBanks);
    }

    const onChangeDestiny = (event:AutoCompleteChangeEvent) =>
    {
        const { value } = event;
        FormMovimiento.setFieldValue("destiny",value);

        if(typeof(value) === "string")
            return

        const { banks } = value as Beneficiary;

        if(banks.length === 0)
            dispatch(createAlert({severity: "error", summary: "Error", detail: `${value.name} no tiene bancos asociados`}))
        else
        {
            FormMovimiento.setFieldValue("destinyBank",banks[0]);
            FormMovimiento.setFieldValue("destinyBankAccount",banks[0].account);
            FormMovimiento.setFieldValue("destinyBankCBU",banks[0].cbu);
            setOptionsDestinyBanks(banks);
            setFilteredDestinyBanks(banks);
        }
    }

    const [OptionsDestinyBanks, setOptionsDestinyBanks] = useState<Bank[]>([]);


    const onChangeDestinyBank = (event:AutoCompleteChangeEvent) =>
    {
        const { value } = event;
        FormMovimiento.setFieldValue("destinyBank",value);
        FormMovimiento.setFieldValue("destinyBankAccount",value.account);
        FormMovimiento.setFieldValue("destinyBankCBU",value.cbu);
    }

    const TemplateBankItem = (item: Bank) =>
    {
        return <p> {item.name} - {item.account} </p>
    }

    const onsubmit = (values: any) =>
    {
        const newMovimiento: Movement =
        {
            type: values.type,
            amount: values.amount,
            concept: values.concept,
            sectional: values.sectional,
            origin: values.origin,
            destiny: values.destiny,
            originBank: values.originBank,
            destinyBank: values.destinyBank,
            numberCheck: values.numberCheck,
            paymentDate: Date.parse(values.paymentDate) / 1000,
            details: values.details,
            extraDetails: values.extraDetails
        }

        if(props.defaultValue !== null)
        {
            return props.callBackUpdate(newMovimiento);
        }
        
        newMovimiento.tempId = Date.now();

        props.callBackDialogAdd(newMovimiento);
    }

    const cleanForm = () => FormMovimiento.setValues(getInitialValue());

    return <Form onSubmit={FormMovimiento.handleSubmit}>
        <FirstRow>
                <SelectButton id="select-type" value={FormMovimiento.values.type} onChange={(e) => FormMovimiento.setFieldValue("type",e.target.value)} options={Types}/>     
            <ContainerInput>
                <FloatLabel>
                    <InputNumber id="amount" useGrouping={false} value={FormMovimiento.values.amount} onChange={e => FormMovimiento.setFieldValue("amount",e.value)} locale="es-ES" maxFractionDigits={2}/>
                    <label htmlFor="amount">Importe</label>    
                </FloatLabel>  
                {getFormErrorMessage("amount")}
            </ContainerInput>
            <ContainerInput>
                <FloatLabel>
                    <AutoComplete id="concept" value={FormMovimiento.values.concept} dropdown forceSelection suggestions={FilteredConcepts} 
                    completeMethod={searchMethodConcepts} itemTemplate={templateOptionConcepts} field="name" onChange={onChangeConcept}/>
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
                    <AutoComplete dropdown forceSelection disabled={FilteredOriginBanks.length === 0} id="originBank" value={FormMovimiento.values.originBank} suggestions={FilteredOriginBanks} 
                    completeMethod={searchMethodOriginBanks} itemTemplate={TemplateBankItem} field="name" onChange={onChangeOriginBank}/>
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
                    <AutoComplete dropdown forceSelection disabled={FilteredDestinyBanks.length === 0} id="destinyBanks" value={FormMovimiento.values.destinyBank} suggestions={FilteredDestinyBanks} 
                    completeMethod={searchMethodDestinyBanks} itemTemplate={TemplateBankItem} field="name" onChange={onChangeDestinyBank}/>
                    <label htmlFor="destinyBanks">Banco</label>
                </FloatLabel>
            </ContainerInput>
            <ContainerInput>
                <FloatLabel>
                    <InputText id="destinyNumberAccount" disabled value={FormMovimiento.values.destinyBankAccount}/>
                    <label htmlFor="destinyNumberAccount">Nro. de Cuenta</label>
                </FloatLabel>
            </ContainerInput>
            <ContainerInput>
                <FloatLabel>
                    <InputText placeholder="C.B.U" id="destinyCBU" disabled value={FormMovimiento.values.destinyBankCBU}/>
                    <label htmlFor="destinyCBU">C.B.U</label>
                </FloatLabel>
            </ContainerInput>
        </ThridRow>

        <ThridRow>
            <Container5050>
                <ContainerInput>
                    <FloatLabel>
                        <InputText id="numberCheck" value={FormMovimiento.values.numberCheck} onChange={e => FormMovimiento.setFieldValue("numberCheck", e.target.value)}/>
                        <label htmlFor="numberCheck">Nro de cheque</label>
                    </FloatLabel>
                    {getFormErrorMessage("numberCheck")}
                </ContainerInput>

                <ContainerInput>
                    <FloatLabel>
                        <Calendar id="paymentDate" placeholder="Fecha de cobro" value={FormMovimiento.values.paymentDate} onChange={e => FormMovimiento.setFieldValue("paymentDate",e.target.value)}  dateFormat="dd/mm/yy"/>
                        <label htmlFor="paymentDate">Fecha de cobro</label>
                    </FloatLabel>
                    {getFormErrorMessage("paymentDate")}
                </ContainerInput>
            </Container5050>

            <ContainerInput>
                <FloatLabel>
                    <InputText id="details" value={FormMovimiento.values.details} onChange={e => FormMovimiento.setFieldValue("details",e.target.value)}/>
                    <label htmlFor="details">Detalles</label>
                </FloatLabel>
                {getFormErrorMessage("details")}
            </ContainerInput>

            <ContainerInput>
                <FloatLabel>
                    <InputText id="extraDetails" value={FormMovimiento.values.extraDetails} onChange={e => FormMovimiento.setFieldValue("extraDetails",e.target.value)}/>
                    <label htmlFor="extraDetails">Detalles extra</label>
                </FloatLabel>
            </ContainerInput>
        </ThridRow>

        
        <FileUpload mode="basic" name="demo[]"  accept="application/pdf" chooseLabel="Adjuntar documento" disabled/>

        <div>
            <Button label={props.defaultValue === null ? 'Agregar' : 'Actualizar' } type="submit" id="button_add"/>
            <Button label="Limpiar" type="button" text onClick={cleanForm}/>
        </div>
    </Form>
}

export default CreateOrUpdateMovimiento;