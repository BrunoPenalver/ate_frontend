import { useEffect } from "react";

import { Toast } from "primereact/toast";
import { useFormik } from "formik";


import { Loader } from "../../Loader/Loader";
import { useMasterComponent } from "../../../hooks/useMasterComponent";
import { DeleteDialog } from "./EliminateDialog";
import { DeactivateDialog } from "./DeactivateDialog";
import { NormalEditDialog } from "./NormalEditDialog";
import { NormalAddDialog } from "./NormalAddDialog";
import { MasterCRUD } from "../../../models/mastersModel";
import {  StyledMastersTable } from "../../tables/mastersTable/MastersTable";



const MasterCRUDComp = ({ item }: { item: MasterCRUD }) => {
  const {
    refetch,
    Loading,
    Errors,
    showModalAdd,
    LoadingAdd,
    errorOnLoad,
    Items,
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
    switchStateModalUpdate,
    ObjectKeys,
    setItemSwitchedStateAndSwitchModalDelete,
    showModalDelete,
    loadingDelete
  } = useMasterComponent({ item });

  const FormAdd = useFormik({
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

  useEffect(() => {
    
    getData();
  }, [refetch]);

  if (Loading) return <Loader text={`Cargando ${plural.toLowerCase()}`} />;

  return (
    <>
      <StyledMastersTable
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
     
        <NormalAddDialog
          labelAgregar={labelAgregar}
          showModalAdd={showModalAdd}
          hideFN={() => switchStateModalAdd()}
          FormAdd={FormAdd}
          ObjectKeys={ObjectKeys}
          OptionsForms={OptionsForms}
          getFormErrorMessage={getFormErrorMessage}
          LoadingAdd={LoadingAdd}
      
        ></NormalAddDialog>

      <NormalEditDialog
        labelActualizar={labelActualizar}
        showModalUpdate={showModalUpdate}
        switchStateModalUpdate={switchStateModalUpdate}
        FormUpdate={FormUpdate}
        ObjectKeys={ObjectKeys}
        OptionsForms={OptionsForms}
        getFormErrorMessage={getFormErrorMessage}
        LoadingUpdate={LoadingUpdate}
      ></NormalEditDialog>

      <DeactivateDialog
        itemSwitchedState={itemSwitchedState}
        singular={singular}
        showModalDesactivate={showModalDesactivate}
        switchStateModalDesactivate={switchStateModalDesactivate}
        handleDesactivate={handleDesactivate}
        loadingDesactivate={loadingDesactivate}
        
      ></DeactivateDialog>

      <DeleteDialog
        itemSwitchedState={itemSwitchedState}
        singular={singular}
        showModalDelete={showModalDelete}
        switchStateModalDelete={setItemSwitchedStateAndSwitchModalDelete}
        handleDelete={handleDelete}
        loadingDelete={loadingDelete}
        refetch={refetch}
        
      ></DeleteDialog>


      <Toast ref={Errors} position="bottom-center" />
    </>
  );
};

export default MasterCRUDComp;
