import useAuth from "../../hooks/auth";
import AdminLayout from "../../layouts/Admin";

const AdminPage = () => 
{
    useAuth();

    return <AdminLayout>
        <h1>Admin</h1>
    </AdminLayout>
}


export default AdminPage;