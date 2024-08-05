import { Column } from "primereact/column";
import { formatDate } from "../../../utils/dates";



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
            {typeof rowData[key.key] === "boolean" && rowData[key.key] === true
              ? "Si"
              : typeof rowData[key.key] === "boolean" &&
                rowData[key.key] === false
              ? "No"
              : rowData[key.key] === null || rowData[key.key] === ""
              ? "---"
              : key.label === "Provincia" ? (
                `${rowData?.province?.name}`
                
              ) : key.label === "Tipo de beneficiario" ? (
                `${rowData?.beneficiaryType?.type}`
                
              ) : rowData[key.key]}
          </span>
        );
      }}
    />
  );
};


// export const SelectColumn = (key: MasterCRUDColumnObjectKeys,options: Option[]) => 
// {
//   return  <Column sortable  field={key.key} header={key.label} body={(rowData) => 
//   {
//     const optionsFiltered = options[key.key];
//     const optionSelected = optionsFiltered.find((option:Option) => option.value === rowData[key.key]);
    
//     return <span  style={{ textDecoration: rowData.active ? "none" : "line-through", color: rowData.active ? "black" : "#dbdbdb",}}>
//       {optionSelected ? optionSelected.label : "---"}
//     </span>
    
//   }}/>
// }


