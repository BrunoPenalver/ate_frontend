import {  useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { getTranslate } from "../utils/translates";
import api from "../utils/api";
import { MasterCRUD } from "../models/mastersModel";
import { formatCuit, validateCBU, validateCUIT } from "../utils/models";

export const useMasterComponent = ({ item }: { item: MasterCRUD }) => {
  /*######################### Obtener los datos de cada CRUD INDIVIDUAL ####################################*/
  const { singular, plural, API, ObjectKeys,tooltip } = item;

  /*######################### Obtener valores iniciales como string vacío ####################################*/
  const getInitialValues = (ObjectKeys: any) => {
    var initialValues: any = {};

    for (const column of ObjectKeys) {
      const { key, field } = column;
      const { type } = field;

      if (type === "readonly") continue;

      initialValues[key] = "";
    }

    return initialValues;
  };

  /*######################### Obtener los errores del form ####################################*/
  const getErrors = async (values: any, ObjectKeys: any) => {
    var errors: any = {};

  
  
    const keys = Object.keys(values);
  
    for (const key of keys) {
      const { field } = ObjectKeys.find((column: any) => column.key === key);
      
      const { rules } = field;
  
      if (!rules) continue;
  
      for (const rule of rules) {
        if (rule === "required") {
          const isRequired = values[key] === "" || values[key] === undefined || values[key] === null;
          if (isRequired) {
            errors[key] = "Campo requerido";
            break; // Salir del bucle si se encuentra un error de campo requerido
          }
        } else {
          if (values[key] !== "" && values[key] !== null) { // Verifica si el campo no está vacío
            if (rule === "notNumber") {
              const regex = /^[^\d]*$/;
              const includesNumber = !regex.test(values[key]);
              if (includesNumber) {
                errors[key] = "Este campo no puede incluir números";
                break; // Salir del bucle si se encuentra un error de noNumber
              }
            }
            if (rule === "number") {
              const regex = /^[0-9]+$/;
              const isANumber = regex.test(values[key]);
              if (!isANumber) {
                errors[key] = "Este campo debe ser un número";
                break; // Salir del bucle si se encuentra un error de number
              }
            }
            if (rule === "validCBU") {  // Nueva regla de validación para CBU
              if (!validateCBU(values[key])) {
                errors[key] = "El CBU ingresado no es válido";
                break; // Salir del bucle si se encuentra un error de CBU
              }
            }
            if (rule === "validCuit") {  // Nueva regla de validación para CBU
              if (!validateCUIT(values[key])) {
                
                errors[key] = "El Cuit ingresado no es válido";
                break; // Salir del bucle si se encuentra un error de CBU
              }
              
            }
            if(rule === "existingCuit")
            { 

              const sanitizedCUIT = values[key].replace(/-/g, '');
              const beneficiaryCode = values?.code; // Asegúrate de que 'code' esté presente en 'values'
  
              // Prepara los parámetros para la solicitud
              const params = { cuit: sanitizedCUIT , code: beneficiaryCode };
              
                const { data } = await api.get(`/beneficiaries/check-cuit`, { params });
                if(data.exists)
                  {
                    
                    errors[key] = `El Cuit ${formatCuit(sanitizedCUIT)} ya está registrado para el beneficiario con código ${data.existingCode}`;
                    break;
                  }
        
              }


            }
          }
        }
      }
    
    return errors;
  };
  
  /*######################### Maneja el error de formik y lo muestra ####################################*/
  const getFormErrorMessage = (key: string, formik: any) => {
    const formikTouched: any = formik.touched;
    const formikErrors: any = formik.errors;

    const isFormFieldValid = (name: string) => {
      return !!(formikTouched[name] && formikErrors[name]);
    };
    return (
      isFormFieldValid(key) && (
        <small className="p-error">{formikErrors[key]}</small>
      )
    );
  };

  const handleAdd = async (values: any, FormAdd: any) => {
    try {
      setLoadingAdd(true);
      
      const PeticionAdd = await api.post(API.post, values);
      Items.push(PeticionAdd.data as (typeof Items)[number]);
      setRefetch(true);
      setShowModalAdd(false);

      Errors.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: `${singular} agregado`,
      });

      setTimeout(() => FormAdd.resetForm(), 1250);
    } catch (error: any) {
      console.log(error);

      Errors.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.response.data.error.errors ? getTranslate(error.response.data.error.errors[0].message) : "Error al crear este elemento",
      });
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleDesactivate = async () => {
    try {
      setLoadingDesactivate(true);
  
      const { id } = itemSwitchedState;
      const URL_API = API.patch?.replace(`:id`, id);
  
      if (URL_API) {
        await api.patch(URL_API, id);
      }
  
      const index = Items.findIndex((item: any) => item.id === id);
  
      if (index === -1) {
        Errors.current?.show({
          severity: "error",
          summary: "Error",
          detail: "No se encontró el item",
        });
        return;
      }
  
      (Items[index] as any).active = !(Items[index] as any).active;
  
      Errors.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: `${singular} ${
          (Items[index] as any).active ? "activado" : "desactivado"
        }`,
      });
  
      setShowModalDesactivate(false);
    } catch (error: any) {
      Errors.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.response.data.message,
      });
    } finally {
      setLoadingDesactivate(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoadingDelete(true);
  
      const { id } = itemSwitchedState;
      const URL_API = API.delete.replace(`:id`, id);
  
      await api.delete(URL_API, id);
  
      const index = Items.findIndex((item: any) => item.id === id);
  
      if (index === -1) {
        Errors.current?.show({
          severity: "error",
          summary: "Error",
          detail: "No se encontró el item",
        });
        return;
      }
  
      Items.splice(index, 1);
  
      Errors.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: `${singular} eliminado`,
      });
  
      setShowModalDelete(false);
    } catch (error: any) {
      Errors.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.response.data.message,
      });
    } finally {
      setShowModalDelete(false);
      setLoadingDelete(false);
    }
  };


  const handleUpdate = async (values: any) => {
    try {
      setLoadingUpdate(true);

      const { id } = values;
      console.log(values)
      const URL_API = API.put.replace(":id", id);

      const { data } = await api.put(URL_API, values);
   
 
      const index = Items.findIndex((item: any) => item.id === id);

      if (index === -1) {
        Errors.current?.show({
          severity: "error",
          summary: "Error",
          detail: "No se encontró el item",
        });
        return;
      }

      (Items[index] as any) = data;

      Errors.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: `${singular} actualizado`,
      });

      switchStateModalUpdate();
    } catch (error: any) {
      Errors.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.response.data.error.errors ? getTranslate(error.response.data.error.errors[0].message) : "Error al crear este elemento",
      });
    } finally {
      setLoadingUpdate(false);
      await getData();
    }
  };

  const getData = async () => 
  {
    setLoading(true);

    try 
    {
      const { data: Response } = await api.get(`${API.get}?search=${SearchText}&page=${CurrentPage}&limit=${ItemsPerPage}`);

      const { data , total} = Response;

      console.log(Response);

      setItems(data);
      setTotalResult(total);
      setErrorOnLoad(false);
    } catch (error: any) 
    {
      setErrorOnLoad(error.response.data.message || true);

      Errors.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error al cargar los datos",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDataOptions = async () => 
  {
    for (const key of ObjectKeys) 
    {
      const { field } = key;

      const { type, getOptionsFrom, options } = field;


      if (type !== "select") continue;

      if (options) {
        setOptionsForms((prev: any) => ({ ...prev, [key.key]: options }));
        continue;
      }

      if (getOptionsFrom) {
        const { data } = await api.get(getOptionsFrom);

        setOptionsForms((prev: any) => ({ ...prev, [key.key]: data }));
      }
    }
  }


  const [SearchText, setSearchText] = useState<string>("");
  const [refetch, setRefetch] = useState(false);
  const [Loading, setLoading] = useState<boolean>(true);
  const Errors = useRef<Toast>(null);
  const [showModalAdd, setShowModalAdd] = useState<boolean>(false);
  const [LoadingAdd, setLoadingAdd] = useState<boolean>(false);
  const [errorOnLoad, setErrorOnLoad] = useState<boolean>(false);
  const [Items, setItems] = useState([]);
  const [TotalResult, setTotalResult] = useState<number>(0);
  const [ItemsPerPage, setItemsPerPage] = useState<number>(10);
  const [CurrentPage, setCurrentPage] = useState<number>(0);
  const [OptionsForms, setOptionsForms] = useState<any>({});
  const labelAgregar = `Agregar ${singular.toLowerCase()}`;
  const labelActualizar = `Actualizar ${singular.toLowerCase()}`;


  const switchStateModalAdd = () => {
    
    setShowModalAdd(!showModalAdd);
  };
  /* ######### Actualizar ######### */
  const [showModalUpdate, setShowModalUpdate] = useState<boolean>(false);
  const [LoadingUpdate, setLoadingUpdate] = useState<boolean>(false);

  /* ######### Desactivar/Activar ######### */
  const [itemSwitchedState, setItemSwitchedState] = useState<any>(
    getInitialValues(ObjectKeys)
  );
  const [showModalDesactivate, setShowModalDesactivate] =
    useState<boolean>(false);
  const [loadingDesactivate, setLoadingDesactivate] = useState<boolean>(false);
  const [showModalDelete, setShowModalDelete] =
  useState<boolean>(false);
const [loadingDelete, setLoadingDelete] = useState<boolean>(false);


  const setItemSwitchedStateAndSwitchModal = (item: any = null) => {
    setItemSwitchedState(item);
    setShowModalDesactivate(true);
  };

  const setItemSwitchedStateAndSwitchModalDelete = (item: any) => {
    setItemSwitchedState(item);
    setShowModalDelete(true);
  };
  const switchStateModalDesactivate = () => {
    setShowModalDesactivate(!showModalDesactivate);
  };

  const switchStateModalDelete = () => {
    setShowModalDelete(!showModalDelete);
  };


  const switchStateModalUpdate = () => setShowModalUpdate(!showModalUpdate);


  

  return {
    refetch,
    setRefetch,
    Loading,
    Errors,
    showModalAdd,
    setShowModalAdd,
    LoadingAdd,
    setLoadingAdd,
    errorOnLoad,
    setErrorOnLoad,
    Items,
    ItemsPerPage,
    CurrentPage,
    TotalResult,
    setTotalResult,
    setItemsPerPage,
    setCurrentPage,
    setItems,
    OptionsForms,
    setOptionsForms,
    labelAgregar,
    labelActualizar,
    switchStateModalAdd,
    showModalUpdate,
    setShowModalUpdate,

    LoadingUpdate,
    setLoadingUpdate,
    itemSwitchedState,
    setItemSwitchedState,
    showModalDesactivate,
    setShowModalDesactivate,
    loadingDesactivate,
    setLoadingDesactivate,
    setItemSwitchedStateAndSwitchModal,
    switchStateModalDesactivate,
    singular,
    plural,
    API,
    ObjectKeys,
    getInitialValues,
    getErrors,
    getFormErrorMessage,
    handleAdd,
    handleDesactivate,
    handleUpdate,
    getData,
    getDataOptions,
    switchStateModalUpdate,
    handleDelete,
    setShowModalDelete,
    showModalDelete,
    loadingDelete,
    setLoadingDelete,
    switchStateModalDelete,
    setItemSwitchedStateAndSwitchModalDelete,
    tooltip,
    setSearchText,
    SearchText
  };
};
