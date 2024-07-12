import { ConfirmDialog } from "primereact/confirmdialog"
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
        <ConfirmDialog />
    </AdminLayout>
    </>
  )
}

export default OrdenesEliminadaPage