import styled from "styled-components";

interface GroupProps {
  direction?: string;
  gap?: string;
  align?: string;
  justify?: string;
  smdirection?: string;
  padding?: string;
  margin?: string;
  background?: string;
  width?: string;
  height?: string;
}

export const Group = styled.div<GroupProps>`
  display: flex;
  flex-direction: ${(props) => props.direction || "column"};
  gap: ${(props) => props.gap || "5px"};
  align-items: ${(props) => props.align || "center"};
  justify-content: ${(props) => props.justify || "center"};
  padding: ${(props) => props.padding || "0"};
  margin: ${(props) => props.margin || "0"};
  background: ${(props) => props.background || "none"};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  @media (max-width: 576px) {
    flex-direction: ${(props) => props.smdirection};
  }
`;
