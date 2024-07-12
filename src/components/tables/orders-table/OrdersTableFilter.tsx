import { InputText } from "primereact/inputtext";


interface OrdersTableFilterProps 
{
  filter: string;
  setFilter: (value: string) => void;
}

export const OrdersTableFilter = (props: OrdersTableFilterProps) => 
{
  const { filter, setFilter } = props;

  return (
    <InputText className="p-inputtext-sm" type="text" placeholder="Buscar..." value={filter || ""} onChange={(e) => setFilter(e.target.value)}/>
  );
}
