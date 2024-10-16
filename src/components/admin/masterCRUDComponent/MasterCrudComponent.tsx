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
import socket from "../../../utils/socket";
import { InputText } from "primereact/inputtext";
import { Paginator } from 'primereact/paginator';
import { useParams } from "react-router-dom";

const MasterCRUDComp = ({ item }: { item: MasterCRUD }) => 
{
  const { title } = useParams();
  const [refetchTrigger, setRefetchTrigger] = useState(0); 

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  const {
    Loading,
    Errors,
    showModalAdd,
    LoadingAdd,
    errorOnLoad,
    Items,TotalResult,
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
    getDataOptions,
    getData,
    setSearchText,
    SearchText,
    setCurrentPage,
    setItemsPerPage,
    switchStateModalUpdate,
    ObjectKeys,
    setItemSwitchedStateAndSwitchModalDelete,
    showModalDelete,
    loadingDelete,
    tooltip
  } = useMasterComponent({ item });

  const FormAdd : any = useFormik({
    initialValues: getInitialValues(ObjectKeys),
    validateOnChange: false,
    validate: (values) => getErrors(values, ObjectKeys),
    onSubmit: async (values) => handleAdd(values, FormAdd),
  });

  const FormUpdate = useFormik({
    initialValues: getInitialValues(ObjectKeys),
    validate: (values) => getErrors(values, ObjectKeys),
    validateOnChange: false,
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
    getData();
  }, [refetchTrigger, item]);  

  useEffect(() => 
  {
    setSearchText("");
    setCurrentPage(0);
    setItemsPerPage(10);
    setFirst(0);
    setRows(10);
    setRefetchTrigger(prev => prev + 1);
  }, [title]);

  useEffect(() => {
    socket.on("updated-entities", () => {
      setRefetchTrigger(prev => prev + 1);  
    });

    return () => {
      socket.off("updated-entities");
    };
  }, []);

  if (Loading) 
    return <Loader text={`Cargando ${plural.toLowerCase()}`} />;

  const onLeaveInput = () => 
  {
    setCurrentPage(0);
    setFirst(0);
    setRefetchTrigger(prev => prev + 1);
  }
  
  const onPageChange = (event: { first: number; rows: number }) =>
  {
    const { first, rows } = event;
    const page = Math.floor(first / rows);

    setFirst(first);
    setRows(rows);

    setCurrentPage(page);
    setItemsPerPage(rows);

    setRefetchTrigger(prev => prev + 1);
  }

  return (
    <>
      <StyledMastersTable
        input={<InputText placeholder="Buscar" value={SearchText} onChange={e => setSearchText(e.target.value)} onBlur={onLeaveInput} onKeyDown={e => e.key === "Enter" && onLeaveInput()}/>}
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
        tooltip={tooltip}
      />
      
      <Paginator 
        first={first} 
        rows={rows} 
        totalRecords={TotalResult} 
        rowsPerPageOptions={[10, 20, 30]} 
        onPageChange={onPageChange}
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      />

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