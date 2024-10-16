import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Fragment, useEffect, useState } from "react";
import { MasterCRUDColumnObjectKeys as Column } from "../../../models/mastersModel";
import { InputMask } from "primereact/inputmask";
import { Asterisk } from "../../Asterisk/Asterisk";




interface Props {
  labelActualizar: string;
  showModalUpdate: boolean;
  switchStateModalUpdate: () => void;
  FormUpdate: any;
  ObjectKeys: Column[];
  OptionsForms: any;
  getFormErrorMessage: (key: string, FormUpdate: any) => any;
  LoadingUpdate: boolean;
  children?: any;
}

export const NormalEditDialog = (props: Props) => {
  const [filteredCities, setFilteredCities] = useState<any[]>([]);
  const [registryTypeDisabled, setRegistryTypeDisabled] = useState<boolean>(false);
  const [isCityDisabled, setIsCityDisabled] = useState(true);

  const {
    labelActualizar,
    showModalUpdate,
    switchStateModalUpdate,
    FormUpdate,
    ObjectKeys,
    OptionsForms,
    getFormErrorMessage,
    LoadingUpdate,
  } = props;


useEffect(() => {
  if (FormUpdate?.values?.province) {
    const isProvinceNumber = typeof FormUpdate?.values?.province === 'number';

    const filtered = OptionsForms?.city.filter((city: any) => {
      if (isProvinceNumber) {
        return city?.provinceId === FormUpdate?.values?.province;
      } else {
        return city?.provinceId === FormUpdate?.values?.province?.id;
      }
    });

    setFilteredCities(filtered);
    setIsCityDisabled(false); // Habilitar el campo de ciudad cuando se selecciona una provincia
  } else {
    setFilteredCities([]);
    setIsCityDisabled(true); // Deshabilitar el campo de ciudad cuando no hay provincia seleccionada
  }
}, [FormUpdate.values.province, OptionsForms]);

  useEffect (() => {
    if (FormUpdate?.values?.registryType?.type === "Concepto" || FormUpdate?.values?.registryType === 2) {
      setRegistryTypeDisabled(true);

  
    } else {
      setRegistryTypeDisabled(false);
      
    }
  }, [FormUpdate.values.registryType]);




  const handleProvinceChange = (e: any) => {
    const selectedProvince = e.value;
    FormUpdate.setFieldValue("province", selectedProvince);


    if (selectedProvince) {
        const filtered = OptionsForms?.city?.filter(
            (city: any) => city?.provinceId === selectedProvince
        );
        setFilteredCities(filtered);
        FormUpdate.setFieldValue("city", "");
    } else {
        setFilteredCities([]);
    }
};

const handleClose = () => {
  FormUpdate.resetForm(); // Resetea el formulario, limpiando valores, errores y touched
  setIsCityDisabled(true); // Opcional: Restablece el estado de isCityDisabled
  switchStateModalUpdate(); // Cierra el diálogo
};

  return (
    <Dialog
      header={labelActualizar}
      style={{ width: "50vw" }}
      visible={showModalUpdate}
      onHide={handleClose}
    >
      <div className="container-modal">
        <form onSubmit={FormUpdate.handleSubmit}>
          {ObjectKeys.map((column: Column) => {
            const { key, label, field, dependsOn, obligatoryField } = column;
            const {
              type,
              emptyOptions,
              as: asField,            
              title,
              value,
              min,
              max,
            } = field;

            if (type === "readonly") return <Fragment key={key} />;

            let TypeComp: any = undefined;

            if (type === "input" && !asField) {
              TypeComp = (
                <>
                  <label htmlFor={label.replace(/\s+/g, '').toLowerCase()}>{label}{obligatoryField && <Asterisk />}</label>
                  <InputText
                    id={label.replace(/\s+/g, '').toLowerCase()}
                    placeholder={label}
                    value={FormUpdate.values[key]}
                    onChange={(e) =>
                      FormUpdate.setFieldValue(key, e.target.value)
                    }
                  />
                </>
              );
            }

            if (type === "input" && asField === "number") {
              TypeComp = (
                <>
                  <label htmlFor={label.replace(/\s+/g, '').toLowerCase()}>{label}{obligatoryField && <Asterisk />}</label>
                  <InputNumber
                    id={label.replace(/\s+/g, '').toLowerCase()}
                    placeholder={label}
                    value={FormUpdate.values[key]}
                    onValueChange={(e) =>
                      FormUpdate.setFieldValue(key, e.value)
                    }
                    useGrouping={false}
                  />
                </>
              );
            }



            if (type === "select" && !title && !value && !dependsOn) {
         
              TypeComp = (
                <>
                  <label htmlFor={label.replace(/\s+/g, '').toLowerCase()}>{label}{obligatoryField && <Asterisk />}</label>
                  <Dropdown
                    id={label.replace(/\s+/g, '').toLowerCase()}
                    key={key}
                    emptyMessage={emptyOptions}
                    placeholder={
                      FormUpdate?.values[key]?.name
                        ? FormUpdate?.values[key]?.name
                        : FormUpdate?.values[key]?.type
                        ? FormUpdate?.values[key]?.type
                        : FormUpdate?.values[key]?.businessname 
                        ? FormUpdate?.values[key]?.businessname
                        : label
                    }
                    options={OptionsForms[key]}
                    optionLabel={OptionsForms[key]?.label}
                    value={FormUpdate.values[key]}
                    onChange={(e) => FormUpdate.setFieldValue(key, e.value)}
                    style={{ width: "100%" }}
                    virtualScrollerOptions={{ itemSize: 38 }}
                    filter
                  />
                </>
              );
            }





            if (type === "select" && title && value && !dependsOn) {
              TypeComp = (
                <>
                  <label htmlFor={label.replace(/\s+/g, '').toLowerCase()}>{label}{obligatoryField && <Asterisk />}</label>
                  <Dropdown
                    id={label.replace(/\s+/g, '').toLowerCase()}
                    key={key}
                    emptyMessage={emptyOptions}
                    placeholder={
                      FormUpdate.values[key].name
                        ? FormUpdate.values[key]?.name
                        : FormUpdate.values[key]?.type
                        ? FormUpdate.values[key]?.type
                        : label
                    }
                    options={OptionsForms[key]}
                    optionLabel={title}
                    value={FormUpdate.values[key]}
                    onChange={(e) => FormUpdate.setFieldValue(key, e.value)}
                    style={{ width: "100%" }}
                    virtualScrollerOptions={{ itemSize: 38 }}
                    filter
                  />
                </>
              );
            }

            if (type === "select" && key === "registryType") {
    
              TypeComp = (
                <>
                  <label htmlFor={label.replace(/\s+/g, '').toLowerCase()}>{label}{obligatoryField && <Asterisk />}</label>
                  <Dropdown
                    id={label.replace(/\s+/g, '').toLowerCase()}
                    disabled
                    key={key}
                    emptyMessage={emptyOptions}
                    placeholder={
                      !FormUpdate.values[key] ? label : FormUpdate.values[key]?.type
                    }
                    options={OptionsForms[key]}
                    optionLabel="label"
                    value={FormUpdate.values[key]}
                    onChange={(e) => FormUpdate.setFieldValue(key, e.value)}  // Usar la función modificada
                    style={{ width: '100%' }}
                   
           
                  />
                </>
              );
            }

            if (type === "select" && dependsOn === "registryType") {
           
            TypeComp = (
              <>
                <label htmlFor={label.replace(/\s+/g, '').toLowerCase()}>{label}{obligatoryField && <Asterisk />}</label>
                <Dropdown
                  id={label.replace(/\s+/g, '').toLowerCase()}
                  key={key}
                  disabled = {registryTypeDisabled}
                  emptyMessage={emptyOptions}
                  placeholder={FormUpdate.values[key]?.type || label}
                  options={OptionsForms[key]}
                  optionLabel="label"
                  value={FormUpdate.values[key]}
                  onChange={(e) => FormUpdate.setFieldValue(key, e.value)}
                  style={{ width: "100%" }}
                  virtualScrollerOptions={{ itemSize: 38 }}
                  filter
                />
              </>
            );
          }

          if (type !== "select" && dependsOn === "registryType"){
      
            TypeComp = (
              <>
                <label htmlFor={label.replace(/\s+/g, '').toLowerCase()}>{label}{obligatoryField && <Asterisk />}</label>
                <InputText
                  disabled = {registryTypeDisabled}
                  id={label.replace(/\s+/g, '').toLowerCase()}
                  placeholder={label}
                  value={FormUpdate.values[key]}
                  onChange={(e) => FormUpdate.setFieldValue(key, e.target.value)}
                />
              </>
            );
          }

            if (type === "select" && key === "province") {

              TypeComp = (
                <>
                  <label htmlFor={label.replace(/\s+/g, '').toLowerCase()}>{label}{obligatoryField && <Asterisk />}</label>
                  <Dropdown
                    id={label.replace(/\s+/g, '').toLowerCase()}
                    key={key}
                    emptyMessage={emptyOptions}
                    placeholder={FormUpdate.values[key]?.name || label}
                    options={OptionsForms[key]}
                    optionLabel="label"
                    value={FormUpdate.values[key]}
                    onChange={handleProvinceChange}
                    style={{ width: "100%" }}
                    virtualScrollerOptions={{ itemSize: 38 }}
                    filter
                  />
                </>
              );
            }

            if (type === "select" && key === "city") {
              TypeComp = (
                <>
                  <label htmlFor={label.replace(/\s+/g, '').toLowerCase()}>{label}{obligatoryField && <Asterisk />}</label>
                  <Dropdown
                    id={label.replace(/\s+/g, '').toLowerCase()}
                    key={key}
                    emptyMessage="No hay opciones disponibles"
                    placeholder={FormUpdate?.values[key]?.name || label}
                    options={filteredCities.length > 0 ? filteredCities : []}
                    optionLabel="label"
                    value={FormUpdate?.values[key]}
                    onChange={(e) => FormUpdate.setFieldValue(key, e.value)}
                    style={{ width: "100%" }}
                    virtualScrollerOptions={{ itemSize: 38 }}
                    filter
                    disabled={isCityDisabled} // Aquí aplicamos el estado para deshabilitar/habilitar
                  />
                </>
              );
            }
            if (type !== "select" && dependsOn === "registryType" && key === "CBU"){
    
              TypeComp = (
                <>
                  <label htmlFor={label.replace(/\s+/g, '').toLowerCase()}>{label}{obligatoryField && <Asterisk />}</label>
                  <InputMask
                    id={label.replace(/\s+/g, '').toLowerCase()}
                    mask="99999999-99999999999999"  // Máscara para el CBU (22 dígitos con un guion en el medio)
                    placeholder="CBU"
                    value={FormUpdate.values[key]}
                    onChange={(e) => FormUpdate.setFieldValue(key, e.value)}
                    style={{ width: '100%' }}
                    disabled={registryTypeDisabled} // Deshabilitar el campo basado en registryTypeDisabled
                  />
                </>
              );
            }
            if (key === "cuit"){
    
              TypeComp = (
                <>
                  <label htmlFor={label.replace(/\s+/g, '').toLowerCase()}>{label}{obligatoryField && <Asterisk />}</label>
                  <InputMask
                    id={label.replace(/\s+/g, '').toLowerCase()}
                    mask="99-99999999-9"  
                    placeholder="Cuit"
                    value={FormUpdate.values[key]}
                    onChange={(e) => FormUpdate.setFieldValue(key, e.value)}
                    style={{ width: '100%' }}
            
                  />
                </>
              );
            }
            if (type === "textarea") {
              TypeComp = (
                <>
                  <label htmlFor={label.replace(/\s+/g, '').toLowerCase()}>{label}{obligatoryField && <Asterisk />}</label>
                  <InputTextarea
                    id={label.replace(/\s+/g, '').toLowerCase()}
                    placeholder={label}
                    value={FormUpdate.values[key]}
                    onChange={(e) =>
                      FormUpdate.setFieldValue(key, e.target.value)
                    }
                    autoResize
                    rows={1}
                  />
                </>
              );
            }

            if (type === "number") {
              TypeComp = (
                <>
                  <label htmlFor={label.replace(/\s+/g, '').toLowerCase()}>{label}{obligatoryField && <Asterisk />}</label>
                  <InputNumber
                  id={label.replace(/\s+/g, '').toLowerCase()}
                    useGrouping={false}
                    placeholder={label}
                    min={min}
                    max={max}
                    value={FormUpdate.values[key]}
                    onValueChange={(e) =>
                      FormUpdate.setFieldValue(key, e.value)
                    }
                  />
                </>
              );
            }

            return (
              <Fragment key={key}>
                {TypeComp}
                {getFormErrorMessage(column.key, FormUpdate)}
              </Fragment>
            );
          })}
          {props.children}
          <Button label="Actualizar" type="submit" loading={LoadingUpdate} />
        </form>
      </div>
    </Dialog>
  );
};
