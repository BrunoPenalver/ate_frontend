import { Button } from "primereact/button";
import api from "../../../../utils/api";
import socket from "../../../../utils/socket";
import BankAccount from "../../../../interfaces/orders/bankAccount";
import { ButtonContainer, StyledEditDialog } from "./styles";

interface DeleteProps {
  isOpen: boolean;
  setIsOpen: (value?: any) => void;
  bankAccount: BankAccount | null;
}

export const DeleteDialog = ({
  isOpen,
  setIsOpen,
  bankAccount,
}: DeleteProps) => {
  return (
    <>
      <StyledEditDialog
        visible={isOpen}
        onHide={() => setIsOpen(false)}
        header={`Eliminar cuenta bancaria`}
      >
        <p>¿Estás seguro que deseas eliminar este elemento?</p>
        <ButtonContainer>
          <Button
            className="p-button-danger"
            label="Eliminar"
            onClick={async () => {
              try {
                await api.delete(`bankAccounts/${bankAccount?.id}`);
                socket.emit("delete-bank-account", bankAccount?.id);
                setIsOpen(false);
              } catch (error) {
                console.error("Error al eliminar la cuenta bancaria:", error);
              }
            }}
          />
          <Button
            className="p-button-primary"
            label="Cancelar"
            onClick={() => setIsOpen()}
          />
        </ButtonContainer>
      </StyledEditDialog>
    </>
  );
};
