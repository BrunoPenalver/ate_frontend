import styled from "styled-components";

export const AttachmentsContainer = styled.div`
display: flex;
gap: 15px;
flex-wrap: wrap;
`;

export const AttachmentContainer = styled.div`
background-color: #f9f9f9;
padding: 10px;
border-radius: 5px;
gap: 15px;
border: 1px solid #e0e0e0;
display: flex;
justify-content: space-between;
align-items: center;

p
{
    cursor: pointer;
    text-decoration: underline;
}
`;