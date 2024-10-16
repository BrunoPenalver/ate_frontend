import { Column } from "primereact/column";
import { useState, useEffect } from "react";
import { StyledDataTable, StyledTableButton, TableContainer, TableTitle, TitleGroup } from "../../../tables/styles";
import { Group } from "../../../Group";
import { BankAccountsFormDialog } from "./BankAccountsFormDialog";
import { StyledCell } from "./styles";
import { DeactivateBankAccountDialog } from "./DeactivateBankAccountDialog";
import { DeleteDialog } from "./DeleteBankAccountDialog";
import BankAccount from "../../../../interfaces/orders/bankAccount";
import { FieldValidation, formatCBU, formatCuit, individualTableisDataComplete } from '../../../../utils/models';
import socket from "../../../../utils/socket";
import { Tooltip } from "primereact/tooltip";

interface DialogProps {
  bankAccounts: BankAccount[];
  beneficiaryId: number;
}

export const BankAccountsTable = ({ bankAccounts, beneficiaryId } : DialogProps) => 
{
  const tooltip = ["Código","Banco", "Tipo de Banco","Tipo de clave única (Si no es Credicoop)","Clave única (Si no es Credicoop)","Alias", "Titular", "CUIT", "Nº Cuenta(Si es Credicoop)", "Tipo de cuenta" ];
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isDeactivateDialogVisible, setIsDeactivateDialogVisible] =useState(false);
  const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [localBankAccounts, setLocalBankAccounts] = useState(bankAccounts);

  useEffect(() => {
    setLocalBankAccounts(
      bankAccounts.filter((account) => account.active !== null)
    );
  }, [bankAccounts]);

  useEffect(() => 
  {
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

  const openAddBankAccountDialog = () => 
  {
    setSelectedBankAccount(null);
    setIsEditing(false);
    setIsDialogVisible(true);
  };

  const openEditBankAccountDialog = (bankAccount : BankAccount) => 
  {
    setSelectedBankAccount(bankAccount);
    setIsEditing(true);
    setIsDialogVisible(true);
  };

  const openDeleteBankAccountDialog = (bankAccount: BankAccount) => 
  {
    setSelectedBankAccount(bankAccount);
    setIsDeleteDialogVisible(!isDeleteDialogVisible);
  };

  const openDeactivateBankAccountDialog = (bankAccount: BankAccount) => 
  {
    setSelectedBankAccount(bankAccount);
    setIsDeactivateDialogVisible(!isDeactivateDialogVisible);
  };

  const closeDialog = () => setIsDialogVisible(false);


  if (localBankAccounts.length === 0 || !localBankAccounts)
    return (
      <>
        <TableContainer>
          <TitleGroup>
            <TableTitle>Listado de cuentas bancarias</TableTitle>{" "}
            <StyledTableButton
            id="addBank"
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
          </Group>
          <StyledTableButton
          id="addBank"
            label="Agregar cuenta"
            className="p-button-primary"
            onClick={openAddBankAccountDialog}
          />
        </TitleGroup>
        <StyledDataTable
          id="banktable"
          value={localBankAccounts.sort((a, b) => a.id - b.id)}
          paginator
          rows={10}
          rowsPerPageOptions={[1, 2, 5, 10]}
          stripedRows
          size="small"
          removableSort
        >
          <Column
            field="id"
            header="ID"
            sortable
            body={(rowData) => (
              <StyledCell $active={rowData?.active}>{rowData.id ? rowData.id : "---"}</StyledCell>
            )}
          />
          <Column
            field="code"
            header="Código"
            sortable
            body={(rowData) => (
              <StyledCell $active={rowData?.active}>{rowData.code ? rowData.code : "---"}</StyledCell>
            )}
          />
          <Column
            field="bank"
            header="Banco"
            sortable
            body={(rowData) => (
              <StyledCell $active={rowData?.active}>{rowData.bank ? rowData.bank : "---"}</StyledCell>
            )}
          />
          <Column
            field="credicoop"
            header="Tipo de Banco"
            sortable
            body={(rowData) => (
              <StyledCell $active={rowData?.active}>{rowData.credicoop ? "Credicoop" : "Otro"}</StyledCell>
            )}
          />
          <Column
            field="cbuType"
            header="Tipo de clave"
            sortable
            body={(rowData) => (
              <StyledCell $active={rowData?.active}>{rowData.cbuType ? rowData.cbuType : "---"}</StyledCell>
            )}
          />
          <Column
            field="CBU"
            header="Nº Clave única"
            sortable
            style={{ minWidth: "150px" }}
            body={(rowData) => (
              <StyledCell $active={rowData?.active}>{rowData.CBU ? formatCBU(rowData.CBU) : "---"}</StyledCell>
            )}
          />
          <Column
            field="alias"
            header="Alias"
            sortable
            body={(rowData) => (
              <StyledCell $active={rowData?.active}>{rowData.alias ? rowData.alias : "---"}</StyledCell>
            )}
          />
          <Column
            field="holder"
            header="Titular"
            sortable
            body={(rowData) => (
              <StyledCell $active={rowData?.active}>{rowData.holder ? rowData.holder : "---"}</StyledCell>
            )}
          />
          <Column
            field="cuit"
            header="Cuit"
            sortable
            style={{ minWidth: "150px" }}
            body={(rowData) => (
              <StyledCell $active={rowData?.active}>{rowData.cuit ? formatCuit(rowData.cuit) : "---"}</StyledCell>
            )}
          />
          <Column
            field="number"
            header="Nº de cuenta"
            sortable
            body={(rowData) => (
              <StyledCell $active={rowData?.active}>{rowData.number ? rowData.number : "---"}</StyledCell>
            )}
          />
          <Column
            field="type"
            header="Tipo de cuenta"
            sortable
            body={(rowData) => (
              <StyledCell $active={rowData?.active}>{rowData.type ? rowData.type : "---"}</StyledCell>
            )}
          />
          <Column
             header={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  
                }}
              >
                <span>Datos correctos</span>
                <i
                  className="pi pi-info-circle"
                  style={{ marginLeft: "8px", cursor: "pointer" }}
                  id="datos-correctos-tooltip"
                  aria-label="Información sobre campos validados"
                ></i>
                <Tooltip
                  target="#datos-correctos-tooltip"
                  position="bottom"
                  className="custom-tooltip"
                >
                  <>
                    {" "}
                    <div>
                      <strong>Campos validados:</strong>
                      <ul style={{ marginTop: "8px"}}>
                        {tooltip &&
                          tooltip.map((item, index) => (
                            <li style={{listStylePosition:"inside"}}  key={index}>{item}</li>
                          ))}
                      </ul>
                    </div>{" "}
                  </>
                </Tooltip>
              </div>
            }
            body={(rowData) => {
              
              // Generar el array de campos con nombre y valor
              const fieldsToValidate: FieldValidation[] = [
                {name: 'code', value: rowData.code},
                { name: 'cuit', value: rowData.cuit },
                { name: 'cbuType', value: rowData.cbuType },
                { name: 'CBU', value: rowData.CBU },
                { name: 'alias', value: rowData.alias },
                { name: 'holder', value: rowData.holder },
                {name: 'bank', value: rowData.bank},
                {name: 'credicoop', value: rowData.credicoop},
                {name: 'number', value: rowData.number},
                {name: 'type', value: rowData.type}

              ];
              

              return individualTableisDataComplete(fieldsToValidate) ? (
                <i
                  className="pi pi-check"
                  style={{ color: "green", fontSize: "1.5em" }}
                  aria-label="Datos completos"
                ></i>
              ) : (
                <i
                  className="pi pi-times"
                  style={{ color: "red", fontSize: "1.5em" }}
                  aria-label="Datos incompletos"
                ></i>
              );
            }}
            style={{ textAlign: 'center', width: '150px' }}
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
                  id="editbankicon"
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
