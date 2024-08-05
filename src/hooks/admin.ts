export const useAdmin = () => 
    {
        const token = document.cookie.split(';').find(row => row.trim().startsWith('token='))?.replace('token=','').trim() || '';
    
        if(token === "")
        {
           window.location.href = '/login';
        }   
    };