import { Dialog } from "primereact/dialog";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask"; // Importa InputMask de PrimeReact
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { AccountTypeTypes } from "../../../../models/accountType";
import api from "../../../../utils/api";
import { validateCBU, validateCUIT } from "../../../../utils/models";
import { Asterisk } from "../../../Asterisk/Asterisk";

// Define las opciones para el campo de tipo utilizando los valores de AccountTypeTypes
const bankTypes = Object.values(AccountTypeTypes).map(type => ({ label: type, value: type }));
const boolTypes = [{ label: "Sí", value: true }, { label: "No", value: false }];
const cbuTypes = [{ label: "CBU", value: "CBU" }, { label: "CVU", value: "CVU" }];

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
`;

const FieldContainer = styled.div`
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledLabel = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
  align-self: flex-start;
`;

const StyledInputText = styled(InputText)`
  width: 100%;
`;

const StyledInputMask = styled(InputMask)`
  width: 100%;
`;

const StyledDropdown = styled(Dropdown)`
  width: 100%;
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 12px;
  align-self: flex-start;
  margin-top: 5px;
`;

interface DialogProps {
  isOpen: boolean;
  bankAccount: any;
  onClose: () => void;
  isEditing: boolean;
  beneficiaryId: number;
}

export const BankAccountsFormDialog = ({ isOpen, bankAccount, onClose, isEditing, beneficiaryId }: DialogProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleClose = () => {
    formik.resetForm(); // Resetea el formulario, limpiando valores y errores
    onClose(); // Llama a la función pasada como prop para cerrar el diálogo
  };

  const formik = useFormik({
    initialValues: {
      code: "",
      credicoop: false,
      bank: "",
      cbuType: "",
      CBU: "",
      alias: "",
      holder: "",
      cuit:"",
      number: "",
      type: "",
    },
    validateOnChange: true,
    enableReinitialize: true,
    validate: (values) => {
      const errors: any = {};

      if (!values.code) {
        errors.code = "Campo requerido";
      }

      // Validación del campo 'credicoop'
      if (values.credicoop === null || values.credicoop === undefined) {
        errors.credicoop = "Campo requerido";
      }
    
      // Validación del campo 'bank'
      if (!values.bank) {
        errors.bank = "Campo requerido";
      }
    
      // Validación del campo cbuType
      if (!values.credicoop && !values.cbuType) {
        errors.cbuType = "Campo requerido";
      } else if (values.credicoop && values.cbuType && !values.CBU) {
        errors.CBU = "Ingrese el nº de clave única";
      }
      // Validación del campo 'CBU'
      if (!values.credicoop && !values.CBU) {
       
        errors.CBU = "Campo requerido";
      } else if (values.credicoop && values.CBU && !values.cbuType) {
        errors.cbuType = "Seleccione un tipo de clave única";
      } else if (
        (!values.credicoop && !validateCBU(values.CBU.replace(/-/g, ''))) ||
        (values.credicoop && values.CBU !== "" && !validateCBU(values.CBU.replace(/-/g, '')))
      ) {
        errors.CBU = "El CBU ingresado no es válido";
      }
    
      // Validación del campo 'number' cuando 'credicoop' es true
      if (values.credicoop && !values.number) {
        errors.number = "Campo requerido";
      }
    
      // Validación del campo 'alias'
      if (!values.alias) {
        errors.alias = "Campo requerido";
      }
    
      // Validación del campo 'holder'
      if (!values.holder) {
        errors.holder = "Campo requerido";
      }
    
      // Validación del campo 'cuit'
      if (!values.cuit) {
        errors.cuit = "Campo requerido";
      } else if (!validateCUIT(values.cuit.replace(/-/g, ''))) {
        errors.cuit = "El CUIT ingresado no es válido";
      }
    
      // Validación del campo 'type'
      if (!values.type) {
        errors.type = "Campo requerido";
      }
    
      return errors;
    },
    onSubmit: async (values) => {
      try {
        if (isEditing) {
          await api.put(`/bankaccounts/${bankAccount?.id}`, { ...values, beneficiaryId });
         
        } else {
          await api.post("/bankaccounts", { ...values, beneficiaryId });
         
        }
        formik.resetForm();
        onClose(); // Cerrar el diálogo al finalizar
      } catch (error) {
        console.error("Error al guardar la cuenta bancaria:", error);
      }
    },
  });

  const handleCredicoopChange = (e: { value: boolean | { value: boolean } }) => {
    // Extraer el valor booleano de 'credicoop'
    const credicoopValue = typeof e.value === 'object' && e.value !== null
      ? e.value.value
      : e.value;
  
    // Establecer 'credicoop' como booleano en Formik
    formik.setFieldValue("credicoop", credicoopValue);
    formik.setFieldTouched("credicoop", true);
    formik.validateForm();
   
  
  };
  

  useEffect(() => {
    if (bankAccount) {
      formik.setValues(bankAccount);
    } else {
      formik.resetForm();
    }
  }, [bankAccount]);
  useEffect(() => {
    console.log("Form values changed:", formik.values);
  }, [formik.values]);
  // Manejador de eventos para el submit
  const handleSubmit = (event:any) => {
  
    setIsSubmitted(true);
    formik.handleSubmit(event);
  };

  // Función para mostrar errores solo si el formulario ha sido enviado una vez o el campo ha sido modificado
  const showError = (field: keyof typeof formik.touched & keyof typeof formik.errors): boolean => {
    return !!((formik.touched[field] || isSubmitted) && formik.errors[field]);
  };

  return (
    <Dialog
      header={isEditing ? "Editar Cuenta Bancaria" : "Agregar Cuenta Bancaria"}
      visible={isOpen}
      style={{ width: "30%" }}
      onHide={handleClose}
    >
      <StyledForm onSubmit={handleSubmit}>
        <FieldContainer>
          <StyledLabel htmlFor="code">Código<Asterisk/></StyledLabel>
          <StyledInputText
            id="code"
            name="code"
            value={formik.values.code}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Código"
          />
          {showError("code") && <ErrorMessage>{formik.errors.code}</ErrorMessage>}
        </FieldContainer>
        <FieldContainer>
          <StyledLabel htmlFor="credicoop">¿Es banco Credicoop?<Asterisk/></StyledLabel>
          <StyledDropdown
            id="credicoop"
            name="credicoop"
            value={formik.values.credicoop || false}
            options={boolTypes}
            onChange={handleCredicoopChange}
            onBlur={formik.handleBlur}
            placeholder={formik.values.credicoop ? "Sí" : !formik.values.credicoop ? "No" : "Seleccionar opción"}
          />
          {showError("credicoop") && <ErrorMessage>{formik.errors.credicoop}</ErrorMessage>}
        </FieldContainer>
        <FieldContainer>
          <StyledLabel htmlFor="bank">Banco<Asterisk/></StyledLabel>
          <StyledInputText
            id="bank"
            name="bank"
            value={formik.values.bank}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Banco"
          />
          {showError("bank") && <ErrorMessage>{formik.errors.bank}</ErrorMessage>}
        </FieldContainer>
        <FieldContainer>
          <StyledLabel htmlFor="cbuType">Tipo de clave{ !formik.values.credicoop && <Asterisk/>}</StyledLabel>
          <StyledDropdown
            id="cbuType"
            name="cbuType"
            value={formik.values.cbuType}
            options={cbuTypes}
            onChange={(e) => formik.setFieldValue("cbuType", e.value)}
            onBlur={formik.handleBlur}
            placeholder={formik.values.cbuType ? formik.values.cbuType : "Seleccionar tipo de clave única"}
          />
          {showError("cbuType") && <ErrorMessage>{formik.errors.cbuType}</ErrorMessage>}
        </FieldContainer>
        <FieldContainer>
          <StyledLabel htmlFor="CBU">CBU{ !formik.values.credicoop && <Asterisk/>}</StyledLabel>
          <StyledInputMask
            id="CBU"
            name="CBU"
            mask="99999999-99999999999999" // Máscara para el CBU con guiones
            value={formik.values.CBU}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="CBU"
          />
          {showError("CBU") && <ErrorMessage>{formik.errors.CBU}</ErrorMessage>}
        </FieldContainer>
        <FieldContainer>
          <StyledLabel htmlFor="alias">Alias<Asterisk/></StyledLabel>
          <StyledInputText
            id="alias"
            name="alias"
            value={formik.values.alias}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Alias"
          />
          {showError("alias") && <ErrorMessage>{formik.errors.alias}</ErrorMessage>}
        </FieldContainer>
        <FieldContainer>
          <StyledLabel htmlFor="holder">Titular<Asterisk/></StyledLabel>
          <StyledInputText
            id="holder"
            name="holder"
            value={formik.values.holder}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Titular"
          />
          {showError("holder") && <ErrorMessage>{formik.errors.holder}</ErrorMessage>}
        </FieldContainer>
        <FieldContainer>
          <StyledLabel htmlFor="cuit">CUIT<Asterisk/></StyledLabel>
          <StyledInputMask
            id="cuit"
            name="cuit"
            mask="99-99999999-9" // Máscara para el CBU con guiones
            value={formik.values.cuit}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Cuit"
          />
          {showError("cuit") && <ErrorMessage>{formik.errors.cuit}</ErrorMessage>}
        </FieldContainer>
        <FieldContainer>
          <StyledLabel htmlFor="number">Número{formik.values.credicoop && <Asterisk/>}</StyledLabel>
          <StyledInputText
            id="number"
            name="number"
            value={formik.values.number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Número"
          />
          {showError("number") && <ErrorMessage>{formik.errors.number}</ErrorMessage>}
        </FieldContainer>
        <FieldContainer>
          <StyledLabel htmlFor="type">Tipo<Asterisk/></StyledLabel>
          <StyledDropdown
            id="type"
            name="type"
            value={formik.values.type}
            options={bankTypes}
            onChange={(e) => formik.setFieldValue("type", e.value)}
            onBlur={formik.handleBlur}
            placeholder={formik.values.type ? formik.values.type : "Seleccionar tipo"}
          />
          {showError("type") && <ErrorMessage>{formik.errors.type}</ErrorMessage>}
        </FieldContainer>
        <StyledButton label="Guardar" type="submit" />
      </StyledForm>
    </Dialog>
  );
};
