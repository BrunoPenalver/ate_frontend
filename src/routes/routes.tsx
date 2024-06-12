import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/login";
import AdminPage from "../pages/admin";
import AuditoriaPage from "../pages/admin/Auditoria";

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
    }
]);

export default router;