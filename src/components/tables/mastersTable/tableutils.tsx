import { Column } from "primereact/column";
import { formatDate } from "../../../utils/dates";
import { formatCBU, formatCuit } from "../../../utils/models";



export const DateColumn = (key: any, index: number) => {
  return (
    <Column
      sortable
      field={key.key}
      header={key.label}
      key={index}
      body={(rowData) => {
        return (
          <span
            style={{
              textDecoration: rowData.active ? "none" : "line-through",
              color: rowData.active ? "black" : "#dbdbdb",
            }}
          >
            {formatDate(rowData[key.key])}
          </span>
        );
      }}
    />
  );
};


export const RegularColumn = (key: any, index: number) => {

  return (
    <Column
      sortable
      field={key.key}
      header={key.label}
      key={index}
      body={(rowData) => {
 
        return (
          <span
            style={{
              textDecoration: rowData.active ? "none" : "line-through",
              color: rowData.active ? "black" : "#dbdbdb",
            }}
          >
            {typeof rowData[key?.key] === "boolean" && rowData[key.key] === true
              ? "Si"
              : typeof rowData[key?.key] === "boolean" &&
                rowData[key?.key] === false
              ? "No"
              : rowData[key?.key] === null || rowData[key?.key] === ""
              ? "---"
              : key?.label === "Provincia" ? (
                `${rowData?.province?.name}`
                
              ) : key?.label === "Localidad" ? (
                `${rowData?.city?.name}`
                
              ) : key?.label === "Tipo de beneficiario" ? (
                `${rowData?.beneficiaryType?.type}`
                
              ) : key?.label === "Tipo de cuenta" ? (
                `${rowData?.accountType?.type}`
                
              ) : key?.label === "Tipo de registro" ? (
                `${rowData?.registryType?.type}`
                
              ) : key?.label === "CUIT" ? (
                `${formatCuit(rowData?.cuit)}`
                
              )  : key?.label === "CBU" ? (
                `${formatCBU(rowData?.CBU)}`
                
              )  : rowData[key?.key]}
          </span>
        );
      }}
    />
  );
};




