import api from "../../../../utils/api";
import socket from "../../../../utils/socket";
import { Button } from "primereact/button";
import BankAccount from "../../../../interfaces/orders/bankAccount";
import { StyledEditDialog } from "../EliminateDialog";
import { ButtonContainer } from "./styles";

interface DeactivateProps {
  isOpen: boolean;
  setIsOpen: (value?: any) => void;
  bankAccount: BankAccount | null;
}

export const DeactivateBankAccountDialog = ({
  isOpen,
  setIsOpen,
  bankAccount,
}: DeactivateProps) => {
  return (
    <>
      <StyledEditDialog
        visible={isOpen}
        onHide={() => setIsOpen(false)}
        header={
          bankAccount && bankAccount?.active
            ? `Desactivar cuenta bancaria`
            : `Activar cuenta bancaria`
        }
      >
        <p>
          {bankAccount && bankAccount?.active
            ? `¿Estás seguro que deseas desactivar esta cuenta bancaria?`
            : `¿Estás seguro que deseas activar esta cuenta bancaria?`}
        </p>
        <ButtonContainer>
        <Button
          className="p-button-danger"
          label={bankAccount && bankAccount?.active ? `Desactivar` : `Activar`}
          onClick={async () => {
            try {
              await api.patch(`bankAccounts/${bankAccount?.id}`);
              socket.emit("deactivate-bank-account", bankAccount?.id);
              setIsOpen(false);
            } catch (error) {
              console.error("Error al desactivar la cuenta bancaria:", error);
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
