import styled from "styled-components";
import { InputText } from "primereact/inputtext";

export const LoginSection = styled.section`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
height: 100vh;
width: 100%;
margin: 0;
padding: 0;
box-sizing: border-box;
`;

export const Logo = styled.img`
width: 100px;
margin-bottom: 20px;
`;

export const Input = styled(InputText)`
width: 300px;
`;