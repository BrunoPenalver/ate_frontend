import { useState , useEffect } from "react";
import api from "../utils/api";
import BankAccount from "../interfaces/orders/bankAccount";



export default function useBankAccounts(filters: string = "")
{
    const [LoadingBankAccount, setLoadingBankAccount] = useState(true);
    const [BankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

    const fetchBankAccounts = async () => 
    {
        try 
        {
            setLoadingBankAccount(true);
            const response = await api.get('/bankAccounts' + filters);
            setBankAccounts(response.data);
        } 
        catch (error) 
        {
            console.log(error);
        }
        finally
        {
            setLoadingBankAccount(false);
        }
    }

    useEffect(() => 
    {
        fetchBankAccounts();
    }, [filters]);


    return { LoadingBankAccount, BankAccounts  };
}