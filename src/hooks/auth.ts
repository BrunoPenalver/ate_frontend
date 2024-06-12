import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = () => 
{   
    const Navigate = useNavigate();
   
    useEffect(() => 
    {
        const user = JSON.parse(localStorage.getItem('user') as string);

        if(!user)
            Navigate('/login');
    }, []);    
    
}

export default useAuth;