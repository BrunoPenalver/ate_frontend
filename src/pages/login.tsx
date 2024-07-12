import { useRef, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { Input, LoginSection, Logo } from "../styles/login";
import { Button } from "primereact/button";
import { Toast, ToastMessage } from "primereact/toast";
import { useDispatch } from "react-redux";
import { setUser } from "../stores/user.slicer";
import { setCookie } from "../utils/cookies";
import api from "../utils/api";

const LoginPage = () => 
{
    const dispatch = useDispatch();
    const Navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const toast = useRef<Toast>(null);

    const onLogin = async (values: any) =>
    {
        try 
        {
            setIsLoading(true);

            const { data } = await api.post("/users/login", values);

            const { token , user } = data;

            setCookie("token", token, 1);

            dispatch(setUser({user}));
            Navigate("/admin/ordenes");
        } 
        catch (error: any ) 
        {
            const ErrorFromAPI = error.response.data.message;

            const toastMessage: ToastMessage = {
              icon: false,
              severity: "error",
              detail: ErrorFromAPI || "Ocurrio un error inesperado",
            };

            toast.current?.show(toastMessage);
        }
        finally
        {
            setIsLoading(false);
        }
    }

    const formik = useFormik({
        initialValues: {
          user: "",
          password: "",
        },
        validate: (values) => 
        {
            const errors: any = {};

            if (!values.user)
                errors.user = "Ingrese un nombre de usuario";

            if (!values.password) 
                errors.password = "Ingrese una contraseña";

            return errors;
        },
        onSubmit: (values) => onLogin(values),
    });

    const getFormErrorMessage = (name: string) => 
    {
        const formikTouched: any = formik.touched;
        const formikErrors: any = formik.errors;

    
        const isFormFieldValid = (name: string) =>
          !!(formikTouched[name] && formikErrors[name]);
        return (
          isFormFieldValid(name) && (
            <small className="p-error">{formikErrors[name]}</small>
          )
        );
    }

    return (
        <LoginSection>
            <Logo alt="Asociacion Trabajadores del Estado" src="/images/isotipo.png" />
            <form className="container-form" onSubmit={formik.handleSubmit}>
                <Input placeholder="Usuario" name="user" value={formik.values.user} onChange={(e) => formik.setFieldValue("user", e.target.value)}/>
                {getFormErrorMessage("user")}
                <Input placeholder="Contraseña" name="password" type="password" value={formik.values.password} onChange={(e) => formik.setFieldValue("password", e.target.value)}/>
                {getFormErrorMessage("password")}
                <Button label="Ingresar" type="submit" loading={isLoading}/>
            </form>
            <Toast ref={toast} position="bottom-center" />
        </LoginSection>
    );
}

export default LoginPage;