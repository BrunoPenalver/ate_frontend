import styled from "styled-components";
import { Panel as PanelNoStyled } from "primereact/panel";

interface AddTextProps {
    enable: boolean;
}

export const AddText = styled.p<AddTextProps>`
    margin: 20px 0;
    cursor: pointer;
    font-weight: bold;
    width: fit-content;
    color: ${({ enable }) => (enable ? 'inherit' : 'gray')};
    text-decoration: ${({ enable }) => (enable ? 'underline' : 'inherit')};
    pointer-events: ${({ enable }) => (enable ? 'auto' : 'none')};
`;

export const ContainerTables = styled.div`
display: grid;
gap: 5%;
grid-template-columns: 1fr 1fr;

@media (max-width: 1200px)
{
    grid-template-columns: 1fr;
}
`;

export const ContainerInfo = styled.div`
margin-top: 20px;
display: flex;
gap: 3px;
flex-direction: column;
`;

export const PanelHeader = styled(PanelNoStyled)`
gap: 10px;`;

export const Panel = styled(PanelNoStyled)`
margin: 20px 0;`;

export const PanelContent = styled.div`
display: grid;
gap: 10px;
grid-template-columns: 1fr 1fr 1fr;

.input
{
    width: 100%;
}

@media (max-width: 768px)
{
    grid-template-columns: 1fr;
    gap: 25px;
}

`;

export const ContainerButtons = styled.div`
display: flex;
gap: 10px;
justify-content: space-between;

div
{
    display: flex;
    gap: 10px;
}

@media (max-width: 768px)
{
    flex-direction: column;

    div
    {
        flex-direction: column;
    }
}
`;