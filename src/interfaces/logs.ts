import User from "./user";

interface Log 
{
    id: number;
    action: "signIn" | "signOut" | "setBreak" | "cancelBreak" | "createNewCase" | "caseInProgress" | "caseClose" | "incrementPriority" | "addObservation" | "addPatient" | "updatePatients" | "updateReason";
    type: string;
    user: User;
    details: 
    {
        type: "text" | "link";
        text: string;
        to: string | null;        
    },
    createdAt?: string;
}

export default Log;