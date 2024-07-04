import { useEffect, useState } from "react";
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

import { Loader } from "../../Loader";
import { AppDispatch, RootState } from "../../../stores/stores";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../../stores/orders.slice";
import { setSpanishLocale } from "../../../utils/locale";
import { locale } from "primereact/api";



export const StyledTable = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    setSpanishLocale()
    locale("es")
    dispatch(fetchOrders(""));
  }, [dispatch]);

  if (loading) {
    return <Loader text="Cargando ordenes de pago" />;
  }

  if (!orders || orders.length === 0) {
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

  // Hacer una copia profunda del array antes de ordenarlo
  const sortedOrders = orders.map(order => ({ ...order })).sort((a, b) => a.id - b.id);

  // Obtener las claves del primer objeto en el array
  const orderKeys = Object.keys(orders[0]);

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
        value={sortedOrders}
        paginator
        rows={10}
        rowsPerPageOptions={[1, 2, 5, 10]}
        stripedRows
        size="small"
        removableSort
        globalFilter={globalFilter}
      >
        {orderKeys
          .filter((tkey) => tkey !== "createdAt" && tkey !== "updatedAt")
          .map((key) =>
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
                filter
                filterPlaceholder="Filtrar..."
              />
            ) : key === "total" ? (
              <Column
                key={key}
                field={key}
                header={getTranslate(key)}
                body={(rowData) => `$${rowData[key]}`}
                sortable
                filter
                filterPlaceholder="Filtrar..."
              />
            ) : (
              <Column
                key={key}
                field={key}
                header={getTranslate(key)}
                sortable
                filter
                filterPlaceholder="Filtrar..."
              />
            )
          )}
          <Column key="actions" header="Acciones" body={() => 
            <>
              <i className="pi pi-pen-to-square" style={{marginRight: "10px", color: "var(--cyan-500)"}}></i>
              <i className="pi pi-trash" style={{color: "var(--red-600)"}} ></i> 
            </>
          } />

      </StyledDataTable>
    </TableContainer>
  );
};
