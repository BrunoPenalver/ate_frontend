import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/login";
import AuditoriaPage from "../pages/admin/Auditoria";
import AgregarPage from "../pages/admin/ordenes/agregar";
import OrdenesActivaPages from "../pages/admin/ordenes";
import OrdenesEliminadasPages from "../pages/admin/ordenes/eliminadas";

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
        element: <Navigate to="/admin/ordenes"/>
    },
    {
        path: "/admin/auditoria",
        element: <AuditoriaPage/>
    },
    {
        path: "/admin/ordenes/",
        element: <OrdenesActivaPages/>
    },
    {
        path: "/admin/ordenes/eliminadas",
        element: <OrdenesEliminadasPages/>
    },
    {
        path: "/admin/ordenes/agregar",
        element: <AgregarPage/>
    }
]);

export default router;