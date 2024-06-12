
import { ReactNode } from 'react';
import { AdminLayoutContainer } from '../styles/layouts/admin';
import Header from '../components/admin/Header';
import Footer from '../components/admin/Footer';

const AdminLayout = ({ children }: { children: ReactNode }) => 
{
    return <>
        <AdminLayoutContainer>
            <Header/>
            {children}
        </AdminLayoutContainer>
        <Footer/>   
    </>
}

export default AdminLayout;