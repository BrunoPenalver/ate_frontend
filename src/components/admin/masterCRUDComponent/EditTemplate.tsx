import { Button } from "primereact/button";

import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Fragment } from "react";
import { MasterCRUDColumnObjectKeys as Column } from "../../../models/mastersModel";




interface Props
{
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

export const NormalEditDialog = (props: Props) => 
{
  const { labelActualizar, showModalUpdate, switchStateModalUpdate, FormUpdate, ObjectKeys, OptionsForms, getFormErrorMessage, LoadingUpdate, } = props;

  return (
    <Dialog header={labelActualizar} style={{ width: "50vw" }} visible={showModalUpdate} onHide={() => switchStateModalUpdate()}>
      <div className="container-modal">
        <form onSubmit={FormUpdate.handleSubmit}>
          {ObjectKeys.map((column:Column) => 
          {
            const { key, label, field } = column;

            const { type, emptyOptions, as: asField, title , value, min, max } = field;

            

            if (type === "readonly") return <Fragment key={key}/>;

            var TypeComp: any = undefined;

            if (type === "input" && !asField)
              TypeComp = (
                <>
                  <label htmlFor={label}>{label}</label>
                  <InputText
                    id={label}
                    placeholder={label}
                    value={FormUpdate.values[key]}
                    onChange={(e) =>
                      FormUpdate.setFieldValue(key, e.target.value)
                    }
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
                    value={FormUpdate.values[key]}
                    onValueChange={(e) =>
                      FormUpdate.setFieldValue(key, e.value)
                    }
                    useGrouping={false}
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
                      placeholder={FormUpdate.values[key].name ? FormUpdate.values[key]?.name : FormUpdate.values[key].type ? FormUpdate.values[key]?.type : label}
                      options={OptionsForms[key]}
                      optionLabel={OptionsForms[key].label}
                      value={FormUpdate.values[key]}
                      onChange={(e) => FormUpdate.setFieldValue(key, e.value)}
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
        placeholder={label}
        options={OptionsForms[key]}
        optionLabel={title}
        value={FormUpdate.values[key]}
        onChange={(e) => FormUpdate.setFieldValue(key, e.value)}
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
                    id={label}
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

              if(type === "number")
              {
                TypeComp = (
                  <>
                    <label htmlFor={label}>{label}</label>
                    <InputNumber useGrouping={false} placeholder={label} min={min} max={max} value={FormUpdate.values[key]} onValueChange={(e) => FormUpdate.setFieldValue(key, e.value)}/>
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
