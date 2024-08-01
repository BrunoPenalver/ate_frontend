import { Attachment } from "../../../interfaces/orders/movement";
import { AttachmentContainer } from "../../../styles/admin/ordenes/movimiento/attachment";

interface Props
{
    attachment: Attachment | string;
    attachmentIndex: number;
    removeFile: (id:number) => void;
}

const sanitizeFileName = (name: string) => {
    const sanitizedName = name.replace(/\/uploads\/\d+_/, "");
    return sanitizedName.split("-").pop() || sanitizedName;
};

const AttachmentComp = (props: Props) =>
{
    const { attachment , removeFile, attachmentIndex} = props;

    const onClickDeleteIcon = () => removeFile(attachmentIndex);

    if(typeof attachment === "string")
    {
        const urlBase = import.meta.env.VITE_BACKEND_URL;
        const attachmentUrl = `${urlBase}${attachment}`;

        const onClick = () => 
        {
            window.open(attachmentUrl, "_blank");
        };

        return <AttachmentContainer >
            <p onClick={onClick}>{sanitizeFileName(attachment)}</p>
            <i className="pi pi-trash" style={{color: "var(--red-600)", cursor: "pointer"}} onClick={onClickDeleteIcon}/> 
        </AttachmentContainer>
    }

   
    const onClickFile = () =>
    {
        const attachmentUrl = URL.createObjectURL(attachment.file);
        window.open(attachmentUrl, "_blank");
    }

    return <AttachmentContainer>
        <p onClick={onClickFile}>{attachment.file.name}</p>
        <i className="pi pi-trash" style={{color: "var(--red-600)", cursor: "pointer"}} onClick={onClickDeleteIcon}/> 
    </AttachmentContainer>
}

export default AttachmentComp;