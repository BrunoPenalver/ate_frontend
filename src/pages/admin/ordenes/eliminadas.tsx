import { StyledTable } from "../../../components/tables/orders-table/OrdersTable"
import AdminLayout from "../../../layouts/Admin"
import useAuth from "../../../hooks/auth"

const OrdenesEliminadaPage = () => 
{
  useAuth();
  
  return (
    <>
    <AdminLayout>
        <StyledTable useActiveOrders={false}/>
    </AdminLayout>
    </>
  )
}

export default OrdenesEliminadaPage