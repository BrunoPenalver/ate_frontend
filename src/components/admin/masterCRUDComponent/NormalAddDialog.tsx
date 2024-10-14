import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Fragment, useEffect, useState } from "react";
import { Asterisk } from "../../Asterisk/Asterisk";
import { MasterCRUDColumnObjectKeys } from "../../../models/mastersModel";
import { InputMask } from "primereact/inputmask";




interface Props {
  labelAgregar: string;
  showModalAdd: boolean;
  hideFN: () => void;
  FormAdd: any;
  ObjectKeys: MasterCRUDColumnObjectKeys[];
  OptionsForms: any;
  getFormErrorMessage: (key: string, FormAdd: any) => any;
  LoadingAdd: boolean;
  children?: any;
}

export const NormalAddDialog = (props: Props) => {
  const {
    labelAgregar,
    showModalAdd,
    hideFN,
    FormAdd,
    ObjectKeys,
    OptionsForms,
    getFormErrorMessage,
    LoadingAdd,
    children,
  } = props;

  const onClose = () => {
    FormAdd.resetForm();
    hideFN();
  }

  const [filteredCities, setFilteredCities] = useState<any[]>([]);
  const [isCityDisabled, setIsCityDisabled] = useState(true);
  const [registryTypeDisabled, setRegistryTypeDisabled] = useState(true);

  useEffect(() => {
    if (FormAdd.values.province) {
      setIsCityDisabled(false);

      // Filtrar las ciudades por el provinceId seleccionado
      const filtered = OptionsForms.city.filter(
        (city: any) => city?.provinceId === FormAdd?.values?.province
      );
      setFilteredCities(filtered);
    } else {
      setIsCityDisabled(true);
      setFilteredCities([]);
    }
  }, [FormAdd.values.province, OptionsForms.city]);

  useEffect(() => {
    
    if (FormAdd.values.registryType === 2 || !FormAdd.values.registryType) {
      setRegistryTypeDisabled(true);
    } else {
      setRegistryTypeDisabled(false);
    }
  }
  , [FormAdd.values.registryType]);

 
//   const handleProvinceChange = (e: any) => {
//     const selectedProvince = e.value;
//     FormUpdate.setFieldValue("province", selectedProvince);
    

//     if (selectedProvince) {
//         const filtered = OptionsForms?.city?.filter(
//             (city: any) => city?.provinceId === selectedProvince
//         );
//         setFilteredCities(filtered);
//         FormUpdate.setFieldValue("city", "");
//     } else {
//         setFilteredCities([]);
//     }
// };

  const handleRegistryTypeChange = (e: any) => {
    FormAdd.setFieldValue("registryType", e.value);
    FormAdd.setFieldValue("CBU", "");
    FormAdd.setFieldValue("alias", "");
    FormAdd.setFieldValue("accountType", null);
    FormAdd.setFieldValue("accountNumber", "");
    if (e.value === 2) {
      setRegistryTypeDisabled(true);
    }else {
      setRegistryTypeDisabled(false);
    }
  }
    


  const handleProvinceChange = (e: any) => {
    FormAdd.setFieldValue("province", e.value);
    setFilteredCities([]);
    FormAdd.setFieldValue("city", ""); // Resetea la ciudad seleccionada
  };
  const submitForm = (e: any) => {
    e.preventDefault();
    FormAdd.handleSubmit()
  }
  return (
    <Dialog
      header={labelAgregar}
      style={{ width: "50vw" }}
      visible={showModalAdd}
      onHide={onClose}
    >
      <div className="container-modal">
        <form onSubmit={submitForm}>
          {ObjectKeys.map((column: MasterCRUDColumnObjectKeys) => {
            const { key, label, field, showInForm,dependsOn,obligatoryField } = column;
           

            if (!showInForm) return <Fragment key={key} />;

            const { type, emptyOptions, as: asField, format, title, value, min, max } = field;

            if (type === "readonly") return <Fragment key={key} />;

            let TypeComp: any = undefined;

            if (type === "input" && !asField)
              TypeComp = (
                <>
                  <label htmlFor={label.replace(/\s+/g, '').toLowerCase()}>{label}{obligatoryField && <Asterisk />}</label>
                  <InputText
                    id={label.replace(/\s+/g, '').toLowerCase()}
                    placeholder={label}
                    value={FormAdd.values[key]}
                    onChange={(e) => FormAdd.setFieldValue(key, e.target.value)}
                  />
                </>
              );

            if (type === "input" && asField === "number")
              TypeComp = (
                <>
                  <label htmlFor={label.replace(/\s+/g, '').toLowerCase()}>{label}{obligatoryField && <Asterisk />}</label>
                  <InputNumber
                    id={label.replace(/\s+/g, '').toLowerCase()}
                    placeholder={label}
                    value={FormAdd.values[key]}
                    onValueChange={(e) => FormAdd.setFieldValue(key, e.value)}
                    useGrouping={false}
                  />
                </>
              );

            if (type === "input" && asField === "password")
              TypeComp = (
                <>
                  <label htmlFor={label.replace(/\s+/g, '').toLowerCase()}>{label}{obligatoryField && <Asterisk />}</label>
                  <InputText
                    id={label.replace(/\s+/g, '').toLowerCase()}
                    placeholder={label}
                    value={FormAdd.values[key]}
                    onChange={(e) => FormAdd.setFieldValue(key, e.target.value)}
                    type="password"
                  />
                </>
              );

            if (type === "input" && asField === "date")
              TypeComp = (
                <>
                  <label htmlFor={label.replace(/\s+/g, '').toLowerCase()}>{label}{obligatoryField && <Asterisk />}</label>
                  <Calendar
                    id={label.replace(/\s+/g, '').toLowerCase()}
                    placeholder={label}
                    value={FormAdd.values[key]}
                    onChange={(e) => FormAdd.setFieldValue(key, e.value)}
                    dateFormat={format}
                  />
                </>
              );
              

            if (type === "select" && !title && !value) {
              TypeComp = (
                <>
                  <label htmlFor={label.replace(/\s+/g, '').toLowerCase()}>{label}{obligatoryField && <Asterisk />}</label>
                  <Dropdown
                    id={label.replace(/\s+/g, '').toLowerCase()}
                    key={key}
                    emptyMessage={emptyOptions}
                    placeholder={
                      FormAdd.values[key] === true
                        ? "Si"
                        : FormAdd.values[key] === false
                        ? "No"
                        : !FormAdd.values[key]
                        ? label
                        : OptionsForms[key].find((option: any) => option.value === FormAdd.values[key])?.label
                    }
                    options={OptionsForms[key]}
                    optionLabel="label"
                    value={FormAdd.values[key]}
                    onChange={(e) => FormAdd.setFieldValue(key, e.value)}
                    style={{ width: '100%' }}
                    virtualScrollerOptions={{ itemSize: 38 }} 
                    filter
                  />
                </>
              );
            }

            if (type === "select" && title && value) {
              TypeComp = (
                <>
                  <label htmlFor={label.replace(/\s+/g, '').toLowerCase()}>{label}{obligatoryField && <Asterisk />}</label>
                  <Dropdown
                    id={label.replace(/\s+/g, '').toLowerCase()}
                    key={key}
                    emptyMessage={emptyOptions}
                    placeholder={
                      FormAdd.values[key] === true
                        ? "Si"
                        : FormAdd.values[key] === false
                        ? "No"
                        : !FormAdd.values[key]
                        ? label
                        : OptionsForms[key].find((option: any) => option[value] === FormAdd.values[key])?.label
                    }
                    options={OptionsForms[key]}
                    optionLabel={title}
                    value={FormAdd.values[key]}
                    onChange={(e) => FormAdd.setFieldValue(key, e.value)}
                    style={{ width: '100%' }}
                    virtualScrollerOptions={{ itemSize: 38 }} 
                    filter
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
                    placeholder={
                      !FormAdd.values[key] ? label : OptionsForms[key].find((option: any) => option.value === FormAdd.values[key])?.label
                    }
                    options={OptionsForms[key]}
                    optionLabel="label"
                    value={FormAdd.values[key]}
                    onChange={handleProvinceChange}  // Usar la función modificada
                    style={{ width: '100%' }}
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
                    disabled={isCityDisabled}
                    emptyMessage="No hay opciones disponibles"
                    placeholder={
                      !FormAdd.values[key] ? label : filteredCities.find(option => option.value === FormAdd.values[key])?.label
                    }
                    options={filteredCities}
                    optionLabel="label"
                    value={FormAdd.values[key]}
                    onChange={(e) => FormAdd.setFieldValue(key, e.value)}
                    style={{ width: '100%' }}
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
                    key={key}
                    emptyMessage={emptyOptions}
                    placeholder={
                      !FormAdd.values[key] ? label : OptionsForms[key].find((option: any) => option.value === FormAdd.values[key])?.label
                    }
                    options={OptionsForms[key]}
                    optionLabel="label"
                    value={FormAdd.values[key]}
                    onChange={handleRegistryTypeChange}  // Usar la función modificada
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
                    disabled={registryTypeDisabled}
                    emptyMessage={emptyOptions}
                    placeholder={
                      !FormAdd.values[key] ? label : OptionsForms[key].find((option: any) => option.value === FormAdd.values[key])?.label
                    }
                    options={OptionsForms[key]}
                    optionLabel="label"
                    value={FormAdd.values[key]}
                    onChange={(e) => FormAdd.setFieldValue(key, e.target.value)}  // Usar la función modificada
                    style={{ width: '100%' }}
                   
           
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
                    value={FormAdd.values[key]}
                    onChange={(e) => FormAdd.setFieldValue(key, e.target.value)}
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
                    value={FormAdd.values[key]}
                    onChange={(e) => FormAdd.setFieldValue(key, e.value)}
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
                    value={FormAdd.values[key]}
                    onChange={(e) => FormAdd.setFieldValue(key, e.value)}
                    style={{ width: '100%' }}
            
                  />
                </>
              );
            }
            

            if (type === "textarea")
              TypeComp = (
                <>
                  <label htmlFor={label.replace(/\s+/g, '').toLowerCase()}>{label}{obligatoryField && <Asterisk />}</label>
                  <InputTextarea
                  id={label.replace(/\s+/g, '').toLowerCase()}
                    placeholder={label}
                    value={FormAdd.values[key]}
                    onChange={(e) => FormAdd.setFieldValue(key, e.target.value)}
                    autoResize
                    rows={1}
                  />
                </>
              );

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
                    value={FormAdd.values[key]}
                    onValueChange={(e) => FormAdd.setFieldValue(key, e.value)}
                  />
                </>
              );


            }


            return (
              <Fragment key={key}>
                {TypeComp}
                {getFormErrorMessage(column.key, FormAdd)}
              </Fragment>
            );
          })}
          {children}
          <Button label="Agregar" type="submit" loading={LoadingAdd} />
        </form>
      </div>
    </Dialog>
  );
};
