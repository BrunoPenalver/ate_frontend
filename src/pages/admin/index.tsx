import { useSelector } from "react-redux";
import User from "../../interfaces/user";
import useAuth from "../../hooks/auth";
import AdminLayout from "../../layouts/Admin";

const AdminPage = () => 
{
    useAuth();

    const { user } = useSelector((state: any) => state.user) as { user: User }; 

    return <AdminLayout>
        <div>
            <h1>Bienvenido:</h1>
            <h2>Firstname: {user.firstname}</h2>
            <h2>Lastname: {user.lastname}</h2>
        </div>
    </AdminLayout>
}


export default AdminPage;