
import { Dialog } from 'primereact/dialog';
import styled from 'styled-components';

interface CellProps {
    $active: boolean;
    }

export const StyledCell = styled.span<CellProps>`
  text-decoration: ${(props) => (props.$active ? "none" : "line-through")};
  color: ${(props) => (props.$active ? "black" : "#dbdbdb")};
`;
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