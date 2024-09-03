import { Column } from "primereact/column";
import { useState, useEffect } from "react";
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
import socket from "../../../../utils/socket";
import { StyledCell } from "./styles";
import { DeactivateBankAccountDialog } from "./DeactivateBankAccountDialog";
import { DeleteDialog } from "./DeleteBankAccountDialog";
import BankAccount from "../../../../interfaces/orders/bankAccount";
import { formatCBU } from '../../../../utils/models';

interface DialogProps {
  bankAccounts: BankAccount[];
  beneficiaryId: number;
}

export const BankAccountsTable = ({ bankAccounts, beneficiaryId } : DialogProps) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isDeactivateDialogVisible, setIsDeactivateDialogVisible] =
    useState(false);
  const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [localBankAccounts, setLocalBankAccounts] = useState(bankAccounts);

  useEffect(() => {
    setLocalBankAccounts(
      bankAccounts.filter((account) => account.active !== null)
    );
  }, [bankAccounts]);

  useEffect(() => {
    socket.on("created-bank-account", (newBankAccount) => {
      setLocalBankAccounts((prev) => [...prev, newBankAccount]);
    });

    socket.on("updated-bank-account", (updatedBankAccount) => {
      setLocalBankAccounts((prev) =>
        prev.map((account) =>
          account.id === updatedBankAccount.id ? updatedBankAccount : account
        )
      );
    });

    socket.on("deactivated-bank-account", (deactivatedBankAccount) => {
      setLocalBankAccounts((prev) =>
        prev.map((account) =>
          account.id === deactivatedBankAccount.id
            ? { ...account, active: deactivatedBankAccount.active }
            : account
        )
      );
    });

    socket.on("deleted-bank-account", (deletedBankAccountId) => {
      setLocalBankAccounts((prev) =>
        prev.filter((account) => account.id !== deletedBankAccountId)
      );
    });

    return () => {
      socket.off("created-bank-account");
      socket.off("updated-bank-account");
      socket.off("deactivated-bank-account");
      socket.off("deleted-bank-account");
    };
  }, []);

  const openAddBankAccountDialog = () => {
    setSelectedBankAccount(null);
    setIsEditing(false);
    setIsDialogVisible(true);
  };

  const openEditBankAccountDialog = (bankAccount : BankAccount) => {
    setSelectedBankAccount(bankAccount);
    setIsEditing(true);
    setIsDialogVisible(true);
  };

  const openDeleteBankAccountDialog = (bankAccount: BankAccount) => {
    setSelectedBankAccount(bankAccount);
    setIsDeleteDialogVisible(!isDeleteDialogVisible);
  };

  const openDeactivateBankAccountDialog = (bankAccount: BankAccount) => {
    setSelectedBankAccount(bankAccount);
    setIsDeactivateDialogVisible(!isDeactivateDialogVisible);
  };

  const closeDialog = () => {
    setIsDialogVisible(false);
  };

  if (localBankAccounts.length === 0 || !localBankAccounts)
    return (
      <>
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
        <BankAccountsFormDialog
          isOpen={isDialogVisible}
          bankAccount={selectedBankAccount}
          onClose={closeDialog}
          isEditing={isEditing}
          beneficiaryId={beneficiaryId}
        />
      </>
    );

  return (
    <>
      <TableContainer>
        <TitleGroup>
          <Group>
            <TableTitle>Listado de cuentas bancarias</TableTitle>
            <AdminTableFilter
              filter={globalFilter}
              setFilter={setGlobalFilter}
            />
          </Group>
          <StyledTableButton
            label="Agregar cuenta"
            className="p-button-primary"
            onClick={openAddBankAccountDialog}
          />
        </TitleGroup>
        <StyledDataTable
          value={localBankAccounts.sort((a, b) => a.id - b.id)}
          paginator
          rows={10}
          rowsPerPageOptions={[1, 2, 5, 10]}
          stripedRows
          size="small"
          removableSort
          globalFilter={globalFilter}
        >
          <Column
            field="id"
            header="ID"
            sortable
            body={(rowData) => (
              <StyledCell $active={rowData?.active}>{rowData.id}</StyledCell>
            )}
          />
          <Column
            field="bank"
            header="Banco"
            sortable
            body={(rowData) => (
              <StyledCell $active={rowData?.active}>{rowData.bank}</StyledCell>
            )}
          />
          <Column
            field="CBU"
            header="CBU"
            sortable
            body={(rowData) => (
              <StyledCell $active={rowData?.active}>{formatCBU(rowData.CBU)}</StyledCell>
            )}
          />
          <Column
            field="alias"
            header="Alias"
            sortable
            body={(rowData) => (
              <StyledCell $active={rowData?.active}>{rowData.alias}</StyledCell>
            )}
          />
          <Column
            field="holder"
            header="Titular"
            sortable
            body={(rowData) => (
              <StyledCell $active={rowData?.active}>{rowData.holder}</StyledCell>
            )}
          />
          <Column
            field="number"
            header="Numero"
            sortable
            body={(rowData) => (
              <StyledCell $active={rowData?.active}>{rowData.number}</StyledCell>
            )}
          />
          <Column
            field="type"
            header="Tipo"
            sortable
            body={(rowData) => (
              <StyledCell $active={rowData?.active}>{rowData.type}</StyledCell>
            )}
          />
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
                    onClick={() => openDeactivateBankAccountDialog(row)}
                  />
                  <i
                    className="pi pi-trash"
                    style={{ color: "var(--red-600)", cursor: "pointer" }}
                    onClick={() => openDeleteBankAccountDialog(row)}
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
        beneficiaryId={beneficiaryId}
      />
      <DeleteDialog
        isOpen={isDeleteDialogVisible}
        setIsOpen={setIsDeleteDialogVisible}
        bankAccount={selectedBankAccount}
      />
      <DeactivateBankAccountDialog
        isOpen={isDeactivateDialogVisible}
        setIsOpen={setIsDeactivateDialogVisible}
        bankAccount={selectedBankAccount}
      />
    </>
  );
};
