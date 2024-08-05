
// import Beneficiary from '../interfaces/orders/beneficiary';

import { MasterCRUD } from "../models/mastersModel";



export const useMastersCRUD = () => {


    const BeneficiarySchema: MasterCRUD = {
      title: "Beneficiarios",
      singular: "Beneficiario",
      plural: "Beneficiarios",
      ObjectKeys: [
        {
          key: "id",
          label: "ID",
          field: { type: "readonly", rules: ["required"] },
          isID: true,
          showInTable: true,
          showInForm: true,
        },
        {
          key: "code",
          label: "Código",
          field: { type: "input", rules: ["required"] },
          showInTable: true,
          showInForm: true,
        },
        {
          key: "businessName",
          label: "Razón social",
          field: { type: "input", rules: ["required"] },
          showInTable: true,
          showInForm: true,
        },
        {
          key:"cuit",
          label:"CUIT",
          field:{type:"input", rules:["required"]},
          showInTable:true,
          showInForm:true,
        },
        {
          key:"phone"
          ,label:"Teléfono",
          field:{type:"input", rules:[]},
          showInTable:true,
          showInForm:true,
        },
        {
          key:"email"
          ,label:"Email",
          field:{type:"input", rules:[]},
          showInTable:true,
          showInForm:true,
        },
        {
          key: "address",
          label: "Dirección",
          field: { type: "input", rules: [] },
          showInTable: false,
          showInForm: true,
        },
        {
          key:"postalCode",
          label:"Código postal",
          field:{type:"input", rules:[]},
          showInTable:false,
          showInForm:true,
        },
        {
          key: "position",
          label: "Cargo",
          field: { type: "input", rules: [] },
          showInTable: false,
          showInForm: true,
        },
        {
          key: "observation",
          label: "Observaciones",
          field: { type: "input", rules: [] },
          showInTable: false,
          showInForm: true,
        },
        {
          key:"contact",
          label:"Contacto",
          field:{type:"input", rules:[]},
          showInTable:false,
          showInForm:true,
        },
        {
          key:"active",
          label:"Activo",
          field:{type:"readonly", rules:[]},
          showInTable:false,
          showInForm:false,

        },
        {
          key: "province",
          label: "Provincia",
          field: { type: "select", rules: ["required"], getOptionsFrom: "provinces/options"},
          showInTable: true,
          showInForm: true,
        },
        // {
        //   key: "city",
        //   label: "Localidad",
        //   field:{type:"input", rules:[]},
        //   showInTable: true,
        //   showInForm: true,
        // },
        {
          key: "beneficiaryType",
          label: "Tipo de beneficiario",
          field: { type: "select", rules: ["required"], getOptionsFrom: "beneficiaryTypes/options"},
          showInTable: true,
          showInForm: true,
        },





        
      ],
      API: {
        get: "beneficiaries",
        post: "beneficiaries",
        put: "beneficiaries/:id",
        patch: "beneficiaries/:id",
        delete: "beneficiaries/:id",
      },
    };
  
  const MastersTab: MasterCRUD[] = [
    BeneficiarySchema,
  ].sort((a, b) => a.plural.localeCompare(b.title));

  return MastersTab;
};
