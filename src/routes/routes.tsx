import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/login";
import AdminPage from "../pages/admin";

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
    }
]);

export default router;