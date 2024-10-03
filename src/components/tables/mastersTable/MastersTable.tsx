import { Column } from "primereact/column";
import { ReactElement, useState } from "react";
import {
  StyledTableButton,
  TableContainer,
  StyledDataTable,
  TableTitle,
  TitleGroup,
} from "./styles";
import { Group } from "../../group/styles";
import { DateColumn, RegularColumn } from "./tableutils";
import {
  MasterCRUDColumnObjectKeys,
  Option,
} from "../../../models/mastersModel";
import { BankAccountsDialog } from "../../admin/masterCRUDComponent/bankAccounts/BankAccountsDialog";
import { DetailDialog } from "../../admin/masterCRUDComponent/beneficiaries/DetailDialog";
import { isDataComplete } from "../../../utils/models";

interface StyledTableProps {
  items: any[];
  ObjectKeys: MasterCRUDColumnObjectKeys[];
  plural: string;
  fn1: (e: any) => void;
  fn2: (e: any) => void;
  label: string;
  fn3: () => void;
  fn4: (e: any) => void;
  detailsFn?: (id: number) => any;
  auxEditFN?: (id: number) => void;
  errorOnLoad: boolean;
  OptionsForms: Option[];
  input: ReactElement;
}

export const StyledMastersTable = (props: StyledTableProps) => {
  const {
    items,
    ObjectKeys,
    plural,
    fn1,
    fn2,
    label,
    fn3,
    fn4,
    errorOnLoad,
    input,
  } = props;


  const [isBankAccountsVisible, setIsBankAccountsVisible] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<any>(null);
  const [isDetailDialogVisible, setIsDetailDialogVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const openDetailDialog = (item: any) => {
    setSelectedItem(item);
    setIsDetailDialogVisible(true);
  };

  const openBankAccounts = (beneficiary: any) => {
    setSelectedBeneficiary(beneficiary);
    setIsBankAccountsVisible(!isBankAccountsVisible);
  };

  if (errorOnLoad) {
    return (
      <TableContainer>
        <TitleGroup>
          <TableTitle>{plural}</TableTitle>{" "}
          <StyledTableButton
            label={label}
            className="p-button-primary"
            onClick={fn3}
          />
        </TitleGroup>
        <p
          style={{
            fontSize: "18px",
            marginTop: "30px",
            fontFamily: "var(--bs-body-font-family)",
          }}
        >
          {typeof errorOnLoad === "string"
            ? errorOnLoad
            : `Error al cargar ${plural.toLowerCase()}`}
        </p>
      </TableContainer>
    );
  }

  return (
    <>
      <TableContainer>
        <TitleGroup>
          <Group>
            <TableTitle>{plural}</TableTitle> {input}
          </Group>
          {plural !== "Cuentas contables" && (
            <StyledTableButton
              label={label}
              className="p-button-primary"
              onClick={fn3}
            />
          )}
        </TitleGroup>
        <StyledDataTable
          value={items.sort((a, b) => a.id + b.id)}
          emptyMessage={`No se encontraron ${plural.toLowerCase()}`}
          stripedRows
          size="small"
          removableSort
        >
          {ObjectKeys?.map((key, index) => {
            if (key?.showInTable && key?.field.as === "date")
              return DateColumn(key, index);

            if (key?.showInTable) return RegularColumn(key, index);

            return null; // Añadido retorno para evitar undefined
          })}

          { plural !== "Cuentas contables" &&
          <Column
            header="Datos correctos"
            body={(rowData) => {
              return isDataComplete(rowData, ObjectKeys) ? (
                <i
                  className="pi pi-check"
                  style={{ color: "green", fontSize: "1.5em" }}
                ></i>
              ) : (
                <i
                  className="pi pi-times"
                  style={{ color: "red", fontSize: "1.5em" }}
                ></i>
              );
            }}
            style={{ textAlign: "center", width: "150px" }}
          />
}
          {plural === "Proovedores" && (
            <Column
              header="Cuentas bancarias"
              body={(row) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      padding: "0 10px",
                      gap: "5px",
                      justifyContent: "center",
                      textDecoration: "none",
                      alignItems: "center",
                      color: "#10b981",
                      cursor: "pointer",
                    }}
                    onClick={() => openBankAccounts(row)}
                  >
                    Ver cuentas
                    <i
                      className="pi pi-search"
                      style={{
                        color: "#10b981",
                        cursor: "pointer",
                      }}
                    ></i>
                  </div>
                );
              }}
            />
          )}
          {plural !== "Cuentas contables" && (
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
                      className="pi pi-search"
                      style={{
                        color: "#10b981",
                        cursor: "pointer",
                      }}
                      onClick={() => openDetailDialog(row)}
                    ></i>
                    <i
                      className="pi pi-pencil"
                      style={{
                        color: "#10b981",
                        cursor: "pointer",
                      }}
                      onClick={() => fn1(row)}
                    ></i>
                    <i
                      className={row?.active ? "pi pi-eye-slash" : "pi pi-eye"}
                      style={{
                        color: row?.active ? "var(--gray-500)" : "#10b981",
                        cursor: "pointer",
                      }}
                      onClick={() => fn2(row)}
                    />
                    <i
                      className="pi pi-trash"
                      style={{ color: "var(--red-600)", cursor: "pointer" }}
                      onClick={() => fn4(row)}
                    />
                  </div>
                );
              }}
            />
          )}
        </StyledDataTable>
      </TableContainer>
      {plural === "Proovedores" && (
        <BankAccountsDialog
          isOpen={isBankAccountsVisible}
          beneficiary={selectedBeneficiary}
          setIsOpen={() => openBankAccounts(null)}
        />
      )}
      <DetailDialog
        isOpen={isDetailDialogVisible}
        data={selectedItem}
        keys={ObjectKeys}
        onHide={() => setIsDetailDialogVisible(false)}
        title="Detalles del Beneficiario"
      />
    </>
  );
};
