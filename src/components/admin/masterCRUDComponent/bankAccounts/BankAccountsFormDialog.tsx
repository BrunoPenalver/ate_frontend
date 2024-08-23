import { Dialog } from "primereact/dialog";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useEffect } from "react";
import styled from "styled-components";
import { AccountTypeTypes } from "../../../../models/accountType";
import api from "../../../../utils/api";
import BankAccount from '../../../../interfaces/orders/bankAccount';

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

const StyledDropdown = styled(Dropdown)`
  width: 100%;
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

interface DialogProps  {
  isOpen: boolean;
  bankAccount: BankAccount | null;
  onClose: () => void;
  isEditing: boolean;
  beneficiaryId: number
}


export const BankAccountsFormDialog = ({ isOpen, bankAccount, onClose, isEditing, beneficiaryId }: DialogProps) => {
  const formik = useFormik({
    initialValues: {
      bank: "",
      CBU: "",
      alias: "",
      holder: "",
      number: "",
      type: "",
    },
    enableReinitialize: true,
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

  return (
    <Dialog
      header={isEditing ? "Editar Cuenta Bancaria" : "Agregar Cuenta Bancaria"}
      visible={isOpen}
      style={{ width: "30%" }}
      onHide={onClose}
    >
      <StyledForm onSubmit={formik.handleSubmit}>
        <FieldContainer>
          <StyledLabel htmlFor="bank">Banco</StyledLabel>
          <StyledInputText
            id="bank"
            name="bank"
            value={formik.values.bank}
            onChange={formik.handleChange}
            placeholder="Banco"
          />
        </FieldContainer>
        <FieldContainer>
          <StyledLabel htmlFor="CBU">CBU</StyledLabel>
          <StyledInputText
            id="CBU"
            name="CBU"
            value={formik.values.CBU}
            onChange={formik.handleChange}
            placeholder="CBU"
          />
        </FieldContainer>
        <FieldContainer>
          <StyledLabel htmlFor="alias">Alias</StyledLabel>
          <StyledInputText
            id="alias"
            name="alias"
            value={formik.values.alias}
            onChange={formik.handleChange}
            placeholder="Alias"
          />
        </FieldContainer>
        <FieldContainer>
          <StyledLabel htmlFor="holder">Titular</StyledLabel>
          <StyledInputText
            id="holder"
            name="holder"
            value={formik.values.holder}
            onChange={formik.handleChange}
            placeholder="Titular"
          />
        </FieldContainer>
        <FieldContainer>
          <StyledLabel htmlFor="number">Número</StyledLabel>
          <StyledInputText
            id="number"
            name="number"
            value={formik.values.number}
            onChange={formik.handleChange}
            placeholder="Número"
          />
        </FieldContainer>
        <FieldContainer>
          <StyledLabel htmlFor="type">Tipo</StyledLabel>
          <StyledDropdown
            id="type"
            name="type"
            value={formik.values.type}
            options={bankTypes}
            onChange={(e) => formik.setFieldValue("type", e.value)}
            placeholder={formik.values.type ? formik.values.type : "Seleccionar tipo"}
          />
        </FieldContainer>
        <StyledButton label="Guardar" type="submit" />
      </StyledForm>
    </Dialog>
  );
};
