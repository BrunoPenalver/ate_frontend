import { ConfirmDialog } from "primereact/confirmdialog"
import { StyledTable } from "../../../components/tables/orders-table/OrdersTable"
import AdminLayout from "../../../layouts/Admin"

const OrdenesEliminadaPage = () => 
{
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