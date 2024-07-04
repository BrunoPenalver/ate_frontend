
import { ReactNode, useRef, useEffect } from 'react';
import { AdminLayoutContainer } from '../styles/layouts/admin';
import Header from '../components/admin/Header';
import Footer from '../components/admin/Footer';
import { Toast } from 'primereact/toast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../stores/stores';
import { clearAlert } from '../stores/alerts.slicer';

const AdminLayout = ({ children }: { children: ReactNode }) => 
{
    const toast = useRef<Toast>(null);
    
    const dispatch = useDispatch();
    const { summary, detail, severity } = useSelector((state: RootState) => state.alerts);

    useEffect(() => 
    {
        if (summary && detail && severity && toast.current) 
        {
            toast.current.show({ severity, summary, detail, life: 3000 });
            dispatch(clearAlert());
        }
    }, [summary, detail, severity, dispatch]);
    
    return <>
        <AdminLayoutContainer>
            <Header/>
            <main className='container'>
                {children}
            </main>
        </AdminLayoutContainer>
        <Footer/>  
        <Toast ref={toast}/> 
    </>
}

export default AdminLayout;