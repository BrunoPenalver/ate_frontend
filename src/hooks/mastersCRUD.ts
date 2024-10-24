
// import Beneficiary from '../interfaces/orders/beneficiary';

import { MasterCRUD } from "../models/mastersModel";




export const useMastersCRUD = (title= "") => 
{ 
  const BeneficiarySchema: MasterCRUD = 
  {
      title: "Proovedores",
      singular: "Proovedor",
      plural: "Proovedores",
      tooltip: [
        "Código", "Tipo de Proveedor", "Razón social", "CUIT", "Email"
      ],
      ObjectKeys: [
        {
          key: "id",
          label: "ID",
          field: { type: "readonly", rules: ["required"] },
          isID: true,
          showInTable: true,
          showInForm: false,
        },
        {
          key: "code",
          label: "Código",
          field: { type: "input", rules: ["required"] },
          showInTable: true,
          showInForm: true,
          obligatoryField: true,
        },
        {
          key: "beneficiaryType",
          label: "Tipo de Proveedor",
          field: { type: "select", rules: ["required"], getOptionsFrom: "beneficiaryTypes/options"},
          showInTable: true,
          showInForm: true,
          obligatoryField: true,
        },
        {
          key: "businessName",
          label: "Razón social",
          field: { type: "input", rules: ["required"] },
          showInTable: true,
          showInForm: true,
          obligatoryField: true,
        },
        {
          key:"cuit",
          label:"CUIT",
          field:{type:"input", rules:["required", "validCuit","existingCuit"]},
          showInTable:true,
          showInForm:true,
          obligatoryField: true,
        },
        {
          key:"email"
          ,label:"Email",
          field:{type:"input", rules:["required"]},
          showInTable:true,
          showInForm:true,
          obligatoryField: true,
        },

        {
          key: "address",
          label: "Dirección",
          field: { type: "input", rules: [] },
          showInTable: false,
          showInForm: true,
        },
        {
          key: "province",
          label: "Provincia",
          field: { type: "select", rules: [], getOptionsFrom: "provinces/options"},
          showInTable: false,
          showInForm: true,
        },
        {
          key: "city",
          label: "Localidad",
          field: { type: "select", rules: [], getOptionsFrom: "cities/options"},
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
          key:"phone"
          ,label:"Teléfono",
          field:{type:"input", rules:[]},
          showInTable:false,
          showInForm:true,
        },

        {
          key:"contact",
          label:"Contacto",
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
          key:"active",
          label:"Activo",
          field:{type:"readonly", rules:[]},
          showInTable:false,
          showInForm:false,

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
    // const ConceptSchema: MasterCRUD = {
    //   title: "Conceptos",
    //   singular: "Concepto",
    //   plural: "Conceptos",
    //   ObjectKeys: [
    //     {
    //       key: "id",
    //       label: "ID",
    //       field: { type: "readonly", rules: ["required"] },
    //       isID: true,
    //       showInTable: true,
    //       showInForm: false,
    //     },
    //     {
    //       key: "code",
    //       label: "Código",
    //       field: { type: "input", rules: ["required"] },
    //       showInTable: true,
    //       showInForm: true,
    //     },
    //     {
    //       key: "registryType",
    //       label: "Tipo de registro",
    //       field: { type: "select", rules: ["required"], getOptionsFrom: "registrytypes/options"},
    //       showInTable: true,
    //       showInForm: true,
    //     },
    //     {
    //       key: "description",
    //       label: "Descripción",
    //       field: { type: "input", rules: ["required"] },
    //       showInTable: true,
    //       showInForm: true,
    //     },

    //     { 
    //       key: "debitAccount",
    //       label: "Cuenta debe",
    //       field: { type: "input", rules: ["required"]},
    //       showInTable: true,
    //       showInForm: true,
    //     },
    //     { 
    //       key: "creditAccount",
    //       label: "Cuenta haber",
    //       field: { type: "input", rules: ["required"]},
    //       showInTable: true,
    //       showInForm: true,
    //     },
    //     {
    //       key: "accountType",
    //       label: "Tipo de cuenta",
    //       field: { type: "select", rules: [], getOptionsFrom: "accounttypes/options"},
    //       showInTable: true,
    //       // dependsOn: "registryType",
    //       showInForm: true,
    //     },
    //     {
    //       key: "accountNumber",
    //       label: "Nº de cuenta",
    //       field: { type: "input", rules: [] },
    //       // dependsOn: "registryType",
    //       showInTable: true,
    //       showInForm: true,
    //     },
    //     {
    //       key: "CBU",
    //       label: "CBU/CVU",
    //       field: { type: "input", rules: [] , as:"mask" },
    //       dependsOn: "registryType",
    //       showInTable: true,
    //       showInForm: true,
    //     },
    //     {
    //       key: "alias",
    //       label: "Alias",
    //       field: { type: "input", rules: [] },
    //       dependsOn: "registryType",
    //       showInTable: true,
    //       showInForm: true,
    //     },

        
    //   ],
    //   API: {
    //     get: "concepts",
    //     post: "concepts",
    //     put: "concepts/:id",
    //     patch: "concepts/:id",
    //     delete: "concepts/:id",
    //   },
    // }
    // // const LedgerAccountSchema: MasterCRUD = {
    // //   title: "Cuentas contables",
    // //   singular: "Cuenta contable",
    // //   plural: "Cuentas contables",
    // //   ObjectKeys: [
    // //     {
    // //       key: "id",
    // //       label: "ID",
    // //       field: { type: "readonly", rules: ["required"] },
    // //       isID: true,
    // //       showInTable: true,
    // //       showInForm: true,
    // //     },
    // //     {
    // //       key: "code",
    // //       label: "Código",
    // //       field: { type: "input", rules: ["required"] },
    // //       showInTable: true,
    // //       showInForm: true,
    // //     },
    // //     {
    // //       key:"number",
    // //       label:"Número",
    // //       field:{type:"input", rules:["required"]},
    // //       showInTable:true,
    // //       showInForm:true,
    // //     },
        
    // //       {
    // //         key:"name",
    // //         label:"Descripción",
    // //         field:{type:"input", rules:["required"]},
    // //         showInTable:true,
    // //         showInForm:true,
    // //       },
        

    // //   ],
    // //   API: {
    // //     get: "accounts",
    // //     post: "accounts",
    // //     put: "accounts/:id",
    // //     patch: "accounts/:id",
    // //     delete: "accounts/:id",
    // //   },
    // // }

    const AccountsSchema: MasterCRUD = {
      title: "Plan de cuentas",
      singular: "Cuenta contable",
      plural: "Cuentas contables",
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
          key: "mainId",
          label: "Id cuenta principal",
          field: { type: "readonly", rules: ["required"] },
          isID: true,
          showInTable: true,
          showInForm: true,
        },
        {
          key: "code",
          label: "Código de cuenta",
          field: { type: "input", rules: ["required"] },
          showInTable: true,
          showInForm: true,
        },
        {
          key:"account",
          label:"Denominación",
          field:{type:"input", rules:["required"]},
          showInTable:true,
          showInForm:true,
        },
        {
          key:"shortCode",
          label:"Cod. abr.",
          field:{type:"input", rules:["required"]},
          showInTable:true,
          showInForm:true,
        },
        {
          key: "balance",
          label: "Saldo",
          field: { type: "input", rules: ["required"] },
          showInTable: true,
          showInForm: true,
        },
        {
          key: "subAccount",
          label: "Subcuenta",
          field: { type: "input", rules: ["required"] },
          showInTable: true,
          showInForm: true,
        },
      ],
      API: {
        get: "accountsplan",
        post: "accountsplan",
        put: "accountsplan/:id",
        patch: "accountsplan/:id",
        delete: "accountsplan/:id",
      },
    }
    
  const MastersTab: MasterCRUD[] = [
    BeneficiarySchema,
    // ConceptSchema,
    // LedgerAccountSchema,
    AccountsSchema
  ].sort((a, b) => a.plural.localeCompare(b.title));

  if(title.length > 0)
    return MastersTab.find((master) => master.title.toLowerCase() === title.toLowerCase());

  return MastersTab;
};
