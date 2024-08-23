import { FilterInput } from "./styles";

interface AdminTableFilterProps {
  filter: string;
  setFilter: (value: string) => void;
}

export const AdminTableFilter = ({ filter , setFilter }:AdminTableFilterProps ) => {
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
