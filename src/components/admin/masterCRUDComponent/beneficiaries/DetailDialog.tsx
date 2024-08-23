import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import styled from "styled-components";
import { MasterCRUDColumnObjectKeys } from "../../../../models/mastersModel";

interface DetailDialogProps {
  isOpen: boolean;
  data: any;
  keys: MasterCRUDColumnObjectKeys[];
  onHide: () => void;
  title: string;
}

export const DetailDialog = (props: DetailDialogProps) => {
  const { isOpen, data, keys, onHide, title } = props;

  if (!data) return null;

  // Filtrar las claves relevantes que no sean ID y tengan showInForm en true
  const filteredKeys = keys.filter(
    (key) => key.showInForm && key.key !== "id" && key.showInForm && key.key !== "observation" && Object.prototype.hasOwnProperty.call(data, key.key)
  );

  // Función para obtener el valor a mostrar según la clave
  const getDisplayValue = (key: string) => {
    switch (key) {
      case "province":
        return data[key]?.name || "";
      case "city":
        return data[key]?.name || "";
      case "beneficiaryType":
        return data[key]?.type || "";
      case "accountType":
        return data[key]?.type || "";
      case "registryType":
        return data[key]?.type || "";
      default:
        return data[key];
    }
  };

  // Mostrar las observaciones si existen
  const observation = data?.observation || "No hay observaciones";

  return (
    <Dialog
      header={title}
      visible={isOpen}
      style={{ width: "40vw" }}
      onHide={onHide}
      footer={<Button label="Cerrar" icon="pi pi-times" onClick={onHide} />}
    >
      <DetailContainer>
        {filteredKeys.map((column) => (
          <DetailRow key={column.key}>
            <DetailLabel>{column.label}:</DetailLabel>
            <DetailValue>{getDisplayValue(column.key)}</DetailValue>
          </DetailRow>
        ))}
        {observation && (
          <ObservationsContainer>
            <DetailLabel>Observaciones:</DetailLabel>
            <DetailObservations>{observation ? observation : "Sin observaciones"}</DetailObservations>
          </ObservationsContainer>
        )}
      </DetailContainer>
    </Dialog>
  );
};

// Estilos para el contenedor del detalle
const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// Estilos para cada fila de detalle
const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--gray-300);
  padding-bottom: 5px;
`;

// Estilos para las etiquetas de detalle
const DetailLabel = styled.span`
  font-weight: bold;
  color: var(--gray-700);
`;

// Estilos para los valores de detalle
const DetailValue = styled.span`
  color: var(--gray-600);
`;

// Estilos para el contenedor de observaciones
const ObservationsContainer = styled.div`
  margin-top: 15px;
  padding-top: 10px;
  
`;

// Estilos para las observaciones
const DetailObservations = styled.p`
  color: var(--gray-600);
  margin-top: 5px;
  white-space: pre-wrap; /* Preserva los saltos de línea y espacios en blanco */
`;
