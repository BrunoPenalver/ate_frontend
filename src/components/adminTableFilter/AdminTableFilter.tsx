import { FilterInput } from "./styles";

export const AdminTableFilter = ({ filter , setFilter }) => {
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
};
