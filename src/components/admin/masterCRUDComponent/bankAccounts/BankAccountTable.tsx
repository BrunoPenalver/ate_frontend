import { Column } from "primereact/column";
import { useState } from "react";
import {
  StyledDataTable,
  StyledTableButton,
  TableContainer,
  TableTitle,
  TitleGroup,
} from "../../../tables/styles";
import { Group } from "../../../Group";
import { AdminTableFilter } from "../../../adminTableFilter/AdminTableFilter";
import { BankAccountsFormDialog } from "./BankAccountsFormDialog";
import api from "../../../../utils/api";

export const BankAccountsTable = ({ bankAccounts, beneficiaryId }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [selectedBankAccount, setSelectedBankAccount] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const openAddBankAccountDialog = () => {
    setSelectedBankAccount(null);
    setIsEditing(false);
    setIsDialogVisible(true);
  };

  const openEditBankAccountDialog = (bankAccount) => {
    setSelectedBankAccount(bankAccount);
    setIsEditing(true);
    setIsDialogVisible(true);
  };

  const closeDialog = () => {
    setIsDialogVisible(false);
  };

  if (bankAccounts.length === 0 || !bankAccounts)
    return (
      <TableContainer>
        <TitleGroup>
          <TableTitle>Listado de cuentas bancarias</TableTitle>{" "}
          <StyledTableButton
            label="Agregar cuenta"
            className="p-button-primary"
            onClick={openAddBankAccountDialog}
          />
        </TitleGroup>
        <p
          style={{
            fontSize: "18px",
            marginTop: "30px",
            fontFamily: "var(--bs-body-font-family)",
          }}
        >
          No hay cuentas cargadas para este usuario
        </p>{" "}
      </TableContainer>
    );

  return (
    <>
      <TableContainer>
        <TitleGroup>
          <Group>
            <TableTitle>Listado de cuentas bancarias</TableTitle>
            <AdminTableFilter filter={globalFilter} setFilter={setGlobalFilter} />
          </Group>
          <StyledTableButton
            label="Agregar cuenta"
            className="p-button-primary"
            onClick={openAddBankAccountDialog}
          />
        </TitleGroup>
        <StyledDataTable
          value={bankAccounts.sort((a, b) => a.id - b.id)}
          paginator
          rows={10}
          rowsPerPageOptions={[1, 2, 5, 10]}
          stripedRows
          size="small"
          removableSort
          globalFilter={globalFilter}
        >
          <Column field="id" header="ID" sortable />
          <Column field="bank" header="Banco" sortable />
          <Column field="CBU" header="CBU" sortable />
          <Column field="alias" header="Alias" sortable />
          <Column field="holder" header="Titular" sortable />
          <Column field="number" header="Numero" sortable />
          <Column field="type" header="Tipo" sortable />
          <Column
            header="Acciones"
            body={(row) => {
              return (
                <div
                  style={{
                    display: "flex",
                    padding: "0 10px",
                    gap: "10px",
                    justifyContent: "center",
                    textDecoration: "none",
                    alignItems: "center",
                  }}
                >
                  <i
                    className="pi pi-pencil"
                    style={{
                      color: "#10b981",
                      cursor: "pointer",
                    }}
                    onClick={() => openEditBankAccountDialog(row)}
                  />
                  <i
                    className={row.active ? "pi pi-eye-slash" : "pi pi-eye"}
                    style={{
                      color: row.active ? "var(--gray-500)" : "#10b981",
                      cursor: "pointer",
                    }}
                    onClick= {async () => api.patch(`bankAccounts/${row.id}`)}
                    
                  />
                  <i
                    className="pi pi-trash"
                    style={{ color: "var(--red-600)", cursor: "pointer" }}
                  />
                </div>
              );
            }}
          />
        </StyledDataTable>
      </TableContainer>
      <BankAccountsFormDialog
        isOpen={isDialogVisible}
        bankAccount={selectedBankAccount}
        onClose={closeDialog}
        isEditing={isEditing}
        beneficiaryId={beneficiaryId} // Pasar beneficiaryId
      />
    </>
  );
};
