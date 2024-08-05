import { SpinnerContainer, SpinnerText, StyledSpinner } from "./styles";

interface LoaderProps {
  text: string;
}

export const Loader = ({ text }: LoaderProps) => {
  return (
    <SpinnerContainer>
      <StyledSpinner strokeWidth="2" />
      <SpinnerText>{text}</SpinnerText>
    </SpinnerContainer>
  );
};
