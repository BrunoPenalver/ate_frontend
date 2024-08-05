import { TabMenu } from "primereact/tabmenu";
import styled from "styled-components";

export const StyledTabMenu = styled(TabMenu)`
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 30px;
  align-items: center;
  .p-tabmenu-nav {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 20px;
    align-items: center;
    border: none;
  }
  .p-tabmenuitem {
    width: 130px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    @media (max-width: 500px) {
      width: 110px;
    }
  }
  .p-menuitem-link {
    width: 100%;
    font-size: 14px;
    font-family: var(--bs-body-font-family);
    text-decoration: none;
    font-weight: 600;

    border-radius: 0;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;

    .p-menuitem-text {
      color: black;
    }
  }
`;
