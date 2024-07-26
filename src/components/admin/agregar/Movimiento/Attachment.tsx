import { Attachment } from "../../../../interfaces/orders/movement";
import { AttachmentContainer } from "../../../../styles/admin/ordenes/agregar/Movimiento/Attachment";

interface Props
{
    attachment: Attachment;
    removeFile: (id:string) => void;
}


const AttachmentComp = (props: Props) =>
{
    const { attachment , removeFile} = props;

    const onClickDeleteIcon = () => removeFile(attachment.id);

    return <AttachmentContainer>
        <p>{attachment.file.name}</p>
        <i className="pi pi-trash" style={{color: "var(--red-600)", cursor: "pointer"}} onClick={onClickDeleteIcon}/> 
    </AttachmentContainer>
}

export default AttachmentComp;