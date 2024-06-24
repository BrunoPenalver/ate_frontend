import { FilterInput } from "../styles";


interface OrdersTableFilterProps 
{
    filter: string;
    setFilter: (value: string) => void;
}

export const OrdersTableFilter = (props: OrdersTableFilterProps) => 
{
  const { filter, setFilter } = props;

  return (
      <div>
        <FilterInput
          type="text"
          placeholder="Buscar..."
          value={filter || ""}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
    );
}
