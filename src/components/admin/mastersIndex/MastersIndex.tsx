import { useState } from "react";


import { Dropdown } from "primereact/dropdown";
import styled from "styled-components";
import { useMastersCRUD } from "../../../hooks/mastersCRUD";
import MasterCRUDComp from "../masterCRUDComponent/MasterCrudComponent";
import { MasterCRUD } from "../../../models/mastersModel";




export const MasterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 25px 0px;
  width: 100%;
`;

export const MasterTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  font-family: var(--bs-body-font-family);
  color: var(--bs-dark);
`;

export const StyledDropdown = styled(Dropdown)`
  width: 100%;
  max-width: 350px;
`;

export const MastersIndex = () => {
  const MastersTab = useMastersCRUD();


  interface MasterOption {
    name: string;
    code: MasterCRUD;
  }

  const mastersMap = MastersTab?.map((master) => {
    return { name: master.title, code: master };
  });
  const [selectedMaster, setSelectedMaster] = useState<MasterOption[]>([]);

  const onChange = (e: any) => {
    setSelectedMaster([e.value]);

  };

  return (
    <>
      <MasterContainer>
        <MasterTitle>Seleccione la entidad a visualizar:</MasterTitle>
        <StyledDropdown
          options={mastersMap}
          value={selectedMaster[0]}
          optionLabel="name"
          placeholder="Seleccionar Tabla"
          onChange={onChange}
        />
      </MasterContainer>

      {selectedMaster?.map((master) => {
        return <MasterCRUDComp key={master?.code.title} item={master?.code} />;
      })}
    </>
  );
};

export default MastersIndex;
