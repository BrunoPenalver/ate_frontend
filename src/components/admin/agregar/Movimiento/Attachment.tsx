import { Attachment } from "../../../../interfaces/orders/movement";

interface Props
{
    attachment: Attachment;
}


const AttachmentComp = (props: Props) =>
{
    const { attachment } = props;

    return <div>
        <p>{attachment.id}</p>
        <p>{attachment.file.name}</p>
    </div>
}

export default AttachmentComp;