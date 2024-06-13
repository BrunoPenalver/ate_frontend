import { useSelector } from "react-redux";
import { Header, Logo, WelcomeText, Menubar, ContainerActions } from "../../styles/admin/header";
import User from "../../interfaces/user";
import { useNavigate } from "react-router-dom";

const HeaderComp = () => 
{
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.user.user) as User;
    

    const items = 
    [
      {
        label: `Ordenes de pago`,
        items:
        [
          { label: "Listado" , command: () => navigate("/ordenes/lista"), },
          { label: "Agregar orden" , command: () => navigate("/ordenes/agregar"), }
        ], 
      },
        {
          label: "Panel de control",
          command: () => navigate("/admin"),
        },
        {
            label: "Auditoria",
            command: () => navigate("/admin/auditoria"),
          },
        {
          label: `${user.firstname} ${user.lastname}`,
          items:
          [
            { label: "Cerrar sesión" , command: () => {} }
          ], 
        },
    ];
    
    return <Header>
        <Logo alt="Banner de ATE" src="/images/isotipo.png"/>
        <ContainerActions>
            <WelcomeText>Bienvenido {user.firstname}</WelcomeText>
            <Menubar model={items}/>
        </ContainerActions>
    </Header>
}

export default HeaderComp;