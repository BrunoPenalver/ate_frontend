import styled from "styled-components";
import { DataTable } from "primereact/datatable";

import { Button } from "primereact/button";
import { Group } from "../../Group";
export const StyledDataTable = styled(DataTable)`
  width: 90%;
  max-width: 1920px;
  

  .p-column-header-content {
    display: flex;
    justify-content: center;
    font-size: 13px;
  }
  .p-sortable-column-icon {
    color: white;
    width: 12px;
    height: 12px;
  }

  th {
    background-color: #10b981;
    color: white;
  }

  th,
  td {
    border: 1px solid #ddd;
  }

  .p-datatable-thead {
    text-align: center;
  }

  .p-datatable-tbody {
    td {
      text-align: center;
      font-size: 13px;
    }
  }

  .p-column-title {
    text-align: center;
  }
  .inactive-row {
    color: #dbdbdb; /* Color para las filas inactivas */
    text-decoration: line-through;
  }

  .p-button-info {
    width: 120px;
  }
  .p-button-danger {
    width: 180px;
  }

  @media (max-width: 1256px) {
    width: 98%;
    .p-datatable-tbody {
      td {
        text-align: center;
        font-size: 12px;
      }
    }
    .p-datatable-tbody {
      td {
        text-align: center;
        font-size: 12px;
      }
    }
  }
`;

export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px 0px;
  gap: 20px;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const TableTitle = styled.h2`
  font-size: 20px;
  width: 100%;
  font-family: var(--bs-body-font-family);
  @media (max-width: 1256px) {
    width: 98%;
  }
`;

export const TitleGroup = styled(Group)`
  width: 90%;
  max-width: 1920px;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;

  @media (max-width: 1256px) {
    width: 98%;
  }
  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const StyledTableButton = styled(Button)`
  display: flex;
  align-self: flex-end;
  width: 300px;
  padding: 5.8px 20px;
  @media (max-width: 700px) {
    align-self: flex-start;
    margin-top: 5px;
    width: 310px;
  }
`;

export const ErrorText = styled.p`
font-size: 18px;
font-weight: 600;
color: red;
text-transform: uppercase;

`;