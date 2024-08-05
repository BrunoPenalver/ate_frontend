export interface Option {
    label: string;
    value: any;
  }
  
  export interface ColumnField 
  {
    type: "readonly" | "input" | "textarea" | "select" | "address" | "number" | "checkbox";
    emptyOptions?: string;
    options?: Option[];
    getOptionsFrom?: string;
    min?: number;
    max?: number;
    value?: string;
    title?: string;
    as?: "text" | "number" | "date" | "password" | "color" ;
    rules?: string[];
    format?: string;
  }
  
  export interface MasterCRUDColumnObjectKeys {
    key: string;
    label: string;
    field: ColumnField;
    isID?: boolean;
    showInTable: boolean;
    showInForm: boolean;
    showInUpdate?: boolean;
  }
  
  export interface MasterCRUD {
    title: string;
    singular: string;
    plural: string;
    ObjectKeys: MasterCRUDColumnObjectKeys[];
    API: {
      get: string;
      post: string;
      put: string;
      delete: string;
      patch?: string;
    };
  }
  