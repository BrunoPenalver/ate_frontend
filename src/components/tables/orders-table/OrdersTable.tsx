import { useState } from "react";
import { OrdersTableFilter } from "./OrdersTableFilter";
import { Group } from "../../Group";
import {
  StyledTableButton,
  TableContainer,
  StyledDataTable,
  TableTitle,
  TitleGroup,
} from "../styles";
import { Column } from "primereact/column";
import { formatDate } from "../../../utils/dates";
import { getTranslate } from "../../../utils/tablesTranslates";
import useOrders from "../../../hooks/orders";
import { Loader } from "../../Loader";



export const StyledTable = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const { LoadingOrders, Orders } = useOrders();
  


  if (LoadingOrders) {
    return <Loader text="Cargando ordenes de pago" />;
  }
  if (Orders?.length === 0) {
    return (
      <TableContainer>
        <TitleGroup>
          <TableTitle>Ordenes de pago</TableTitle>
          <StyledTableButton
            label={"etiqueta de botón"}
            className="p-button-primary"
          />
        </TitleGroup>
        <p
          style={{
            fontSize: "18px",
            marginTop: "30px",
            fontFamily: "var(--bs-body-font-family)",
          }}
        >
          No hay ordenes cargadas
        </p>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <TitleGroup>
        <Group>
          <TableTitle>Ordenes de pago</TableTitle>
          <OrdersTableFilter
            filter={globalFilter}
            setFilter={setGlobalFilter}
          />
        </Group>
        {/* <StyledTableButton
          label={"Etiqueta de botón"}
          className="p-button-primary"
        /> */}
      </TitleGroup>
      <StyledDataTable
        value={Orders && Orders?.sort((a, b) => a.id - b.id)}
        paginator
        rows={10}
        rowsPerPageOptions={[1, 2, 5, 10]}
        stripedRows
        size="small"
        removableSort
        globalFilter={globalFilter}
      >
        {Object.keys(Orders[0])?.filter(tkey => tkey !== "createdAt" && tkey !== "updatedAt").map((key) =>
          key === "date" ? (
            <Column
              key={key}
              field={key}
              header={getTranslate(key)}
              body={(rowData) => formatDate(rowData[key])}
              sortable
              filter 
              filterPlaceholder="Filtrar..."
              
            />
          ) : key === "active" ? (
            <Column
              key={key}
              field={key}
              header={getTranslate(key)}
              body={(rowData) => (rowData[key] ? "Si" : "No")}
              sortable
              filter filterPlaceholder="Filtrar..."
            />
          ):  key === "total" ? (
            <Column
              key={key}
              field={key}
              header={getTranslate(key)}
              body={(rowData) => `$${rowData[key]}`}
              sortable
              filter filterPlaceholder="Filtrar..."
            />
          ) :  (
            <Column key={key} field={key} header={getTranslate(key)} sortable filter filterPlaceholder="Filtrar..." />
          )
        )}
      </StyledDataTable>
    </TableContainer>
  );
};
