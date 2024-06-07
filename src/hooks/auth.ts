import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = () => 
{   
    const Navigate = useNavigate();
    const user = localStorage.getItem('user');
    
    useEffect(() => {
        if(user === null)
            Navigate('/login');
    }, []);    
    
    return user;
}

export default useAuth;