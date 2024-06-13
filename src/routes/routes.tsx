import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/login";
import AdminPage from "../pages/admin";
import AuditoriaPage from "../pages/admin/Auditoria";
import { OrdersPage } from "../pages/payment-orders/OrdersPage";
import { AddOrderPage } from "../pages/add-order/AddOrder";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login"/>
    },
    {
        path: "/login",
        element: <LoginPage/>
    },
    {
        path: "/admin",
        element: <AdminPage/>
    },
    {
        path: "/admin/auditoria",
        element: <AuditoriaPage/>
    },
    {
        path: "/ordenes/lista",
        element: <OrdersPage/>
    },
    {
        path: "/ordenes/agregar",
        element: <AddOrderPage/>
    }
]);

export default router;