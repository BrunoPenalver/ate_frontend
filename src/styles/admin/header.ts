import { Menubar as MenubarNoStyled } from "primereact/menubar";
import styled from "styled-components";

export const Header = styled.header`
padding: 10px 20px;
display: flex;
align-items: center;
justify-content: space-between;
border-bottom: 1px solid rgb(229, 229, 229);
margin-bottom: 20px;`;

export const Logo = styled.img`
width: 75px;`;

export const WelcomeText = styled.p`
text-decoration: none;
font-size: 14px;
font-family: var(--bs-body-font-family);
font-weight: 600;
color: var(--bs-body-color);`;

export const ContainerActions = styled.div`
display: flex;
align-items: center;
gap: 10px;

`;

export const Menubar = styled(MenubarNoStyled)`
  background-color: transparent;
  border: none;
  height: 100%;
  .p-menubar-root-list {
    margin-bottom: 0px;
    @media (max-width: 960px) {
      position: absolute;
      left: unset !important;
      top: 74px;
      right: 0;
      width: 150px;
    }
  }
  .p-menuitem-link {
    text-decoration: none;
    font-size: 14px;
    font-family: var(--bs-body-font-family);
    font-weight: 600;
    color: var(--bs-body-color);
    text-decoration: underline;
  }
  .p-menubar-button {
    color: var(--bs-body-color);
  }
`;
