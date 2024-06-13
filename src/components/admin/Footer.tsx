import { Footer } from "../../styles/admin/footer";

const FooterComp = () => 
{
    return <Footer>
        <p>Sistema de Órdenes de pago - © {new Date().getFullYear()} PMS Argentina S.A.</p>
    </Footer>
}

export default FooterComp;