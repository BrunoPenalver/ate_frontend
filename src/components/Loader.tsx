



import styled from "styled-components";
import { ProgressSpinner } from "primereact/progressspinner";

interface LoaderProps {
    text: string;
  }

export const SpinnerContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  flex-direction: column;
  height: 300px;
  gap: 20px;
`;

export const SpinnerText = styled.p`
  font-size: 20px;
  font-family: var(--bs-body-font-family);
  font-weight: 600;
  text-align: center;
  color: var(--bs-dark);
`;

export const StyledSpinner = styled(ProgressSpinner)`
  width: 100px;
  height: 100px;
`;


export const Loader = ({ text }: LoaderProps) => {
  return (
    <SpinnerContainer>
      <StyledSpinner strokeWidth="2" />
      <SpinnerText>{text}</SpinnerText>
    </SpinnerContainer>
  );
};
