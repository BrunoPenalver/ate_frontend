import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/login";
import AdminPage from "../pages/admin";
import AuditoriaPage from "../pages/admin/Auditoria";
import { OrdersPage } from "../pages/payment-orders/OrdersPage";
import AgregarPage from "../pages/ordenes/agregar";

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
        element: <AgregarPage/>
    }
]);

export default router;