import styled from "styled-components";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import Concept from "../../../interfaces/orders/concept";
import Beneficiary from '../../../interfaces/orders/beneficiary';

export const StyledEditDialog = styled(Dialog)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px;
  width: 90%;
  max-width: 550px;
  @media (max-width: 576px) {
    height: 350px;
    flex-direction: column;
  }

  .p-dialog-header {
    width: 100%;
  }
  .p-dialog-title {
    text-align: center;
    width: 100%;
  }

  .p-dialog-header-icon,
  .p-dialog-header-close,
  .p-link {
    display: none;
  }
  .p-dialog-content {
    display: flex;
    width: 100%;
    padding: 0 50px;
    text-align: center;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  padding-bottom: 20px;
  justify-content: center;
  align-items: center;
  gap: 20px;
  .p-button-primary {
    width: 140px;
  }
  .p-button-danger {
    width: 140px;
  }
  @media (max-width: 576px) {
    flex-wrap: wrap;

    .p-button-primary {
      font-size: 12px;
    }
    .p-button-danger {
      font-size: 12px;
    }
  }
`;

interface StyledTableProps {
  itemSwitchedState: Concept | Beneficiary | null;
  singular: string
  showModalDelete: boolean
  switchStateModalDelete: () => void
  handleDelete: () => void
  loadingDelete: boolean
  refetch: () => void
}

export const DeleteDialog = ({
  itemSwitchedState,
  singular,
  showModalDelete,
  switchStateModalDelete,
  handleDelete,
  loadingDelete,
  refetch,

}: StyledTableProps) => {



  const handleDeleteAndRefetch = async () => {
    await handleDelete();
    refetch();
  };


  return (
    <>
      
      {itemSwitchedState && (
        <>
            <StyledEditDialog
              header={`Eliminar ${singular.toLowerCase()}`}
              visible={showModalDelete}
              onHide={() => switchStateModalDelete()}
            >
              <p>¿Estás seguro que deseas eliminar este elemento?</p>
              <ButtonContainer>
                <Button
                  className="p-button-danger"
                  label="Eliminar"
                  onClick={handleDeleteAndRefetch}
                  loading={loadingDelete}
                />
                <Button
                  className="p-button-primary"
                  label="Cancelar"
                  onClick={switchStateModalDelete}
                  loading={loadingDelete}
                />
              </ButtonContainer>
            </StyledEditDialog>
       
        </>
      )}
    </>
  );
};
