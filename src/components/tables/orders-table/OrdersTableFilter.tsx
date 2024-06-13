import { FilterInput } from "../styles";


export const OrdersTableFilter = ({filter,setFilter}) => {
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
