import styled from "styled-components";
import { Panel as PanelNoStyled } from "primereact/panel";

export const Panel = styled(PanelNoStyled)`
border-top: inherit !important;
margin-top: 10px;
input
{
    width: 100%;
}`;

export const FirstRowHeader = styled.div`
display: grid;
gap: 10px;
grid-template-columns: min-content 1fr min-content 1fr 1fr;
margin-bottom: 10px;`;

export const SecondRowHeader = styled.div`
display: grid;
gap: 10px;
grid-template-columns: 60% auto auto;
`;

export const Form = styled.form`
margin-top: 30px;
display: flex;
flex-direction: column;
gap: 25px;

.p-autocomplete, .p-button, .p-dropdown, input
{
    height: fit-content;
}

.p-autocomplete, .p-float-label, .p-inputnumber, .p-inputtext
{
    width: 100%;
}`;


export const ContainerInput = styled.div`
display: flex;
flex-direction: column;
gap: 5px;

input, .p-calendar, .p-dropdown 
{
    width: 100%;
}
`;

export const FirstRow = styled.div`
display: grid;
gap: 10px;
grid-template-columns: 1fr 1fr 1fr; 

.p-selectbutton
{
    display: grid;
    grid-template-columns: 1fr 1fr;
}

.p-button 
{
    text-align: center;
}

.subchildren
{
    display: flex;
    gap: 5px;
}

.subchildren input
{
    width: 100%;

}
`;

export const SecondRow = styled.div`
display: grid;
gap: 10px;
grid-template-columns: 1fr 1fr;`;

export const Container5050 = styled.div`
display: grid;
gap: 5px;
grid-template-columns: auto auto;
`;

export const ThridRow = styled.div`
display: grid;
gap: 10px;
grid-template-columns: 1fr 1fr 1fr;
`;

export const FourthRow = styled.div`
display: grid;
gap: 10px;
grid-template-columns:  1fr 2fr;
`;

export const Dropzone = styled.input`
width: 100%;
border: 2px dashed #ccc;
display: flex;
justify-content: center;
align-items: center;
gap: 10px;
background-color: #f9f9f9;

display: inline-block;
width: 100%;
padding: 120px 0 0 0;
height: 100px;
overflow: hidden;
-webkit-box-sizing: border-box;
-moz-box-sizing: border-box;
box-sizing: border-box;
background: url('https://cdn0.iconfinder.com/data/icons/phosphor-thin-vol-2/256/export-thin-128.png') center center no-repeat #f9f9f9;
border-radius: 20px;
background-size: 60px 60px;
`;