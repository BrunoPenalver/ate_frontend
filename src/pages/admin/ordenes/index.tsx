import { ConfirmDialog } from "primereact/confirmdialog"
import { StyledTable } from "../../../components/tables/orders-table/OrdersTable"
import AdminLayout from "../../../layouts/Admin"
import useAuth from "../../../hooks/auth"

const OrdenesActivasPage = () => 
{
  useAuth();

  return (
    <>
    <AdminLayout>
        <StyledTable useActiveOrders={true}/>
        <ConfirmDialog />
    </AdminLayout>
    </>
  )
}

export default OrdenesActivasPage