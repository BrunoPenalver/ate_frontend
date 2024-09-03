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
import BankAccount from '../../../../interfaces/orders/bankAccount';
import { validateCBU } from "../../../../utils/models";

// Define las opciones para el campo de tipo utilizando los valores de AccountTypeTypes
const bankTypes = Object.values(AccountTypeTypes).map(type => ({ label: type, value: type }));

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
  bankAccount: BankAccount | null;
  onClose: () => void;
  isEditing: boolean;
  beneficiaryId: number;
}

export const BankAccountsFormDialog = ({ isOpen, bankAccount, onClose, isEditing, beneficiaryId }: DialogProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: {
      code: "",
      bank: "",
      CBU: "",
      alias: "",
      holder: "",
      number: "",
      type: "",
    },
    enableReinitialize: true,
    validate: (values) => {
      const errors: any = {};
      if (!values.code) errors.code = "Campo requerido";
      if (!values.bank) errors.bank = "Campo requerido";
      if (!values.CBU) {
        errors.CBU = "Campo requerido";
      } else if (!validateCBU(values.CBU.replace(/-/g, ''))) {  // Validación adicional para CBU sin guiones
        errors.CBU = "El CBU ingresado no es válido";
      }
      if (!values.alias) errors.alias = "Campo requerido";
      if (!values.holder) errors.holder = "Campo requerido";
      if (!values.number) errors.number = "Campo requerido";
      if (!values.type) errors.type = "Campo requerido";
      return errors;
    },
    onSubmit: async (values) => {
      try {
        if (isEditing) {
          await api.put(`/bankaccounts/${bankAccount?.id}`, { ...values, beneficiaryId });
        } else {
          await api.post("/bankaccounts", { ...values, beneficiaryId });
          formik.resetForm();
        }
        onClose(); // Cerrar el diálogo al finalizar
      } catch (error) {
        console.error("Error al guardar la cuenta bancaria:", error);
      }
    },
  });

  useEffect(() => {
    if (bankAccount) {
      formik.setValues(bankAccount);
    } else {
      formik.resetForm();
    }
  }, [bankAccount]);

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
      onHide={onClose}
    >
      <StyledForm onSubmit={handleSubmit}>
        <FieldContainer>
          <StyledLabel htmlFor="code">Código</StyledLabel>
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
          <StyledLabel htmlFor="bank">Banco</StyledLabel>
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
          <StyledLabel htmlFor="CBU">CBU</StyledLabel>
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
          <StyledLabel htmlFor="alias">Alias</StyledLabel>
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
          <StyledLabel htmlFor="holder">Titular</StyledLabel>
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
          <StyledLabel htmlFor="number">Número</StyledLabel>
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
          <StyledLabel htmlFor="type">Tipo</StyledLabel>
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
