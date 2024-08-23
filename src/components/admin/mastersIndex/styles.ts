import { Dropdown } from "primereact/dropdown";
import styled from "styled-components";

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
  max-width: 400px;
  @media (max-width: 430px) {
    width: 90%;
  }
`;
