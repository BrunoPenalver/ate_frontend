import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Fragment } from "react";

import { MasterCRUDColumnObjectKeys } from "../../../models/mastersModel";

interface Props 
{
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

export const NormalAddDialog = (props: Props) => 
{
  const { labelAgregar, showModalAdd, hideFN, FormAdd, ObjectKeys, OptionsForms, getFormErrorMessage, LoadingAdd, children} = props;

  return (
    <Dialog
      header={labelAgregar}
      style={{ width: "50vw" }}
      visible={showModalAdd}
      onHide={hideFN}
    >
      {/*------------------------------ Este es el add modal-----------------------------------*/}
      <div className="container-modal">
        <form onSubmit={FormAdd.handleSubmit}>
          {ObjectKeys.map((column:MasterCRUDColumnObjectKeys) => 
          {
            const { key, label, field, showInForm } = column;

            if (!showInForm) return <Fragment key={key}/>;

            const { type, emptyOptions, as: asField, format , title , value, min, max } = field;

            if (type === "readonly") return <Fragment key={key}/>;

            var TypeComp: any = undefined;

            if (type === "input" && !asField)
              TypeComp = ( 
                <>
                  <label htmlFor={label}>{label}</label>
                  <InputText
                    id={label}
                    placeholder={label}
                    value={FormAdd.values[key]}
                    onChange={(e) => FormAdd.setFieldValue(key, e.target.value)}
                  />
                </>  
            );


            if (type === "input" && asField === "number")
              TypeComp = (
                <>
                  <label htmlFor={label}>{label}</label>
                  <InputNumber
                    id={label}
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
                  <label htmlFor={label}>{label}</label>
                  <InputText 
                    id={label}
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
                  <label htmlFor={label}>{label}</label>
                  <Calendar
                    id={label}
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
                    <label htmlFor={label}>{label}</label>
                    <Dropdown
                      id={label}
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
                    />
                  </>
                );
              }
              
              if (type === "select" && title && value) {
                TypeComp = (
                  <>
                    <label htmlFor={label}>{label}</label>
                    <Dropdown
                      id={label}
                      key={key}
                      emptyMessage={emptyOptions}
                      placeholder={
                        FormAdd.values[key] === true
                          ? "Si"
                          : FormAdd.values[key] === false
                          ? "No"
                          : !FormAdd.values[key]
                          ? label
                          : OptionsForms[key].find(option => option[value] === FormAdd.values[key])?.label
                      }
                      options={OptionsForms[key]}
                      optionLabel={title}
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
                  <label htmlFor={label}>{label}</label>
                  <InputTextarea
                    placeholder={label}
                    value={FormAdd.values[key]}
                    onChange={(e) => FormAdd.setFieldValue(key, e.target.value)}
                    autoResize
                    rows={1}
                  />
                </>
              );

            if(type === "number")
            {
              TypeComp = (
                <>
                  <label htmlFor={label}>{label}</label>
                  <InputNumber useGrouping={false} placeholder={label} min={min} max={max} value={FormAdd.values[key]} onValueChange={(e) => FormAdd.setFieldValue(key, e.value)}/>
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
