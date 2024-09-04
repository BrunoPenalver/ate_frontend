import { useEffect, useState } from "react";
import { Toast } from "primereact/toast";
import { useFormik } from "formik";
import { Loader } from "../../Loader/Loader";
import { useMasterComponent } from "../../../hooks/useMasterComponent";
import { DeleteDialog } from "./EliminateDialog";
import { DeactivateDialog } from "./DeactivateDialog";
import { NormalEditDialog } from "./NormalEditDialog";
import { NormalAddDialog } from "./NormalAddDialog";
import { MasterCRUD } from "../../../models/mastersModel";
import { StyledMastersTable } from "../../tables/mastersTable/MastersTable";
import socket from "../../../utils/socket"; // Asegúrate de importar el socket
import { InputText } from "primereact/inputtext";
import { Paginator } from 'primereact/paginator';

const MasterCRUDComp = ({ item }: { item: MasterCRUD }) => 
{
  const [refetchTrigger, setRefetchTrigger] = useState(0); 

  const [SearchText, setSearchText] = useState("");
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  const {
    Loading,
    Errors,
    showModalAdd,
    LoadingAdd,
    errorOnLoad,
    Items,
    TotalResult,
    OptionsForms,
    labelAgregar,
    labelActualizar,
    showModalUpdate,
    LoadingUpdate,
    itemSwitchedState,
    showModalDesactivate,
    loadingDesactivate,
    singular,
    plural,
    switchStateModalAdd,
    setItemSwitchedStateAndSwitchModal,
    switchStateModalDesactivate,
    getInitialValues,
    getErrors,
    getFormErrorMessage,
    handleAdd,
    handleDesactivate,
    handleDelete,
    handleUpdate,
    getData,
    getDataOptions,
    setCurrentPage,
    setItemsPerPage,
    switchStateModalUpdate,
    ObjectKeys,
    setItemSwitchedStateAndSwitchModalDelete,
    showModalDelete,
    loadingDelete,
  } = useMasterComponent({ item });

  const FormAdd : any = useFormik({
    initialValues: getInitialValues(ObjectKeys),
    validate: (values) => getErrors(values, ObjectKeys),
    onSubmit: async (values) => handleAdd(values, FormAdd),
  });

  const FormUpdate = useFormik({
    initialValues: getInitialValues(ObjectKeys),
    validate: (values) => getErrors(values, ObjectKeys),
    onSubmit: async (values) => handleUpdate(values),
  });

  const setItemToUpdateAndSwitchModal = (item: any) => {
    for (const key in item) {
      const isEditable = ObjectKeys.find(
        (column: any) =>
          column.key === key && (column.type !== "readonly" || column.isID)
      );

      if (isEditable) FormUpdate.setFieldValue(key, item[key]);
    }
    switchStateModalUpdate();
  };

  useEffect(() => 
  {
    getDataOptions();
  },[]);

  useEffect(() => 
  {
    getData(SearchText);
  }, [refetchTrigger,item]);  

  useEffect(() => {
    socket.on("updated-entities", () => {1
     
      setRefetchTrigger(prev => prev + 1);  
    });

    return () => {
      socket.off("updated-entities");
    };
  }, []);

  if (Loading) 
    return <Loader text={`Cargando ${plural.toLowerCase()}`} />;

  const handleSearch = (newValue: string) => setSearchText(newValue);
  const onLeave = () => setRefetchTrigger(prev => prev + 1);
  
  const onPageChange = (event: { first: number; rows: number }) =>
  {
    const { first, rows } = event;
    const page = Math.ceil(first / rows)

    setFirst(first);
    setRows(rows);

    setCurrentPage(page);
    setItemsPerPage(rows);

    setRefetchTrigger(prev => prev + 1);
  }

  return (
    <>
      <StyledMastersTable
        input={<InputText placeholder="Buscar" value={SearchText} onChange={e => handleSearch(e.target.value)} onBlur={onLeave} onKeyDown={e => e.key === "Enter" && onLeave()}/>}
        items={Items}
        ObjectKeys={ObjectKeys}
        errorOnLoad={errorOnLoad}
        OptionsForms={OptionsForms}
        fn1={setItemToUpdateAndSwitchModal}
        fn2={setItemSwitchedStateAndSwitchModal}
        fn3={switchStateModalAdd}
        fn4={setItemSwitchedStateAndSwitchModalDelete}
        plural={plural}
        label={labelAgregar}
      />
      
      <Paginator first={first} rows={rows} totalRecords={TotalResult} rowsPerPageOptions={[10, 20, 30]} onPageChange={onPageChange} />


      <NormalAddDialog
        labelAgregar={labelAgregar}
        showModalAdd={showModalAdd}
        hideFN={() => switchStateModalAdd()}
        FormAdd={FormAdd}
        ObjectKeys={ObjectKeys}
        OptionsForms={OptionsForms}
        getFormErrorMessage={getFormErrorMessage}
        LoadingAdd={LoadingAdd}/>

      <NormalEditDialog
        labelActualizar={labelActualizar}
        showModalUpdate={showModalUpdate}
        switchStateModalUpdate={switchStateModalUpdate}
        FormUpdate={FormUpdate}
        ObjectKeys={ObjectKeys}
        OptionsForms={OptionsForms}
        getFormErrorMessage={getFormErrorMessage}
        LoadingUpdate={LoadingUpdate}/>

      <DeactivateDialog
        itemSwitchedState={itemSwitchedState}
        singular={singular}
        showModalDesactivate={showModalDesactivate}
        switchStateModalDesactivate={switchStateModalDesactivate}
        handleDesactivate={handleDesactivate}
        loadingDesactivate={loadingDesactivate}/>

      <DeleteDialog
        itemSwitchedState={itemSwitchedState}
        singular={singular}
        showModalDelete={showModalDelete}
        switchStateModalDelete={() => setItemSwitchedStateAndSwitchModalDelete(null)}
        handleDelete={handleDelete}
        loadingDelete={loadingDelete}
        refetch={() => setRefetchTrigger(prev => prev + 1)}/>

      <Toast ref={Errors} position="bottom-center" />
    </>
  );
};

export default MasterCRUDComp;
