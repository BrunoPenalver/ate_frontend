import { MasterCRUDColumnObjectKeys } from "../models/mastersModel";

export const validateCBU = (cbu: string): boolean => {
  // Remover cualquier guion del CBU
  const sanitizedCBU = cbu.replace(/-/g, "");

  // Verificar longitud y formato
  if (sanitizedCBU.length !== 22 || !/^\d+$/.test(sanitizedCBU)) {
    return false;
  }

  // Validar la primera parte (Banco y Sucursal)
  const multiplicadores1 = [7, 1, 3, 9, 7, 1, 3];
  let suma1 = 0;
  for (let i = 0; i < 7; i++) {
    suma1 += parseInt(sanitizedCBU[i]) * multiplicadores1[i];
  }

  const digitoVerificador1 = parseInt(sanitizedCBU[7]);
  const calculoDigito1 = 10 - (suma1 % 10);
  const resultado1 =
    (calculoDigito1 === 10 ? 0 : calculoDigito1) === digitoVerificador1;

  // Validar la segunda parte (Número de cuenta)
  const multiplicadores2 = [3, 9, 7, 1, 3, 9, 7, 1, 3, 9, 7, 1, 3];
  let suma2 = 0;
  for (let i = 8; i < 21; i++) {
    suma2 += parseInt(sanitizedCBU[i]) * multiplicadores2[i - 8];
  }

  const digitoVerificador2 = parseInt(sanitizedCBU[21]);
  const calculoDigito2 = 10 - (suma2 % 10);
  const resultado2 =
    (calculoDigito2 === 10 ? 0 : calculoDigito2) === digitoVerificador2;

  return resultado1 && resultado2;
};

// 123456781234567890123

export const formatCBU = (cbu: string) => {
  if (cbu && cbu.length === 22) {
    return `${cbu.slice(0, 8)}-${cbu.slice(8)}`;
  }
  return cbu; // Retorna el CBU sin cambios si no tiene 22 dígitos
};

export const formatCuit = (cuit: string) => {
  if (cuit && cuit.length === 11) {
    return `${cuit.slice(0, 2)}-${cuit.slice(2, 10)}-${cuit.slice(10)}`;
  }
  return cuit; // Retorna el CUIT sin cambios si no tiene 11 dígitos
};

export const validateCUIT = (cuit: string): boolean => {
  // Remover cualquier guion del CUIT
  const sanitizedCUIT = cuit.replace(/-/g, "");

  // Verificar si el CUIT tiene exactamente 11 dígitos y solo contiene números
  if (sanitizedCUIT.length !== 11 || !/^\d+$/.test(sanitizedCUIT)) {
    // console.log(sanitizedCUIT.length);
    // console.log("false por esto");
    return false;
  }

  // Definir los multiplicadores fijos
  const multiplicadores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let suma = 0;

  // Calcular la suma de las multiplicaciones
  for (let i = 0; i < 10; i++) {
    suma += parseInt(sanitizedCUIT[i]) * multiplicadores[i];
  }

  // Calcular el módulo 11 de la suma
  const modulo = suma % 11;
  let digitoVerificadorCalculado = 11 - modulo;

  // Ajustar el dígito verificador calculado según la regla
  if (digitoVerificadorCalculado === 11) digitoVerificadorCalculado = 0;
  if (digitoVerificadorCalculado === 10) digitoVerificadorCalculado = 9;

  // Obtener el dígito verificador real del CUIT
  const digitoVerificadorReal = parseInt(sanitizedCUIT[10]);

  // Verificar si el dígito verificador calculado coincide con el dígito verificador real
  // console.log(digitoVerificadorCalculado === digitoVerificadorReal);
  return digitoVerificadorCalculado === digitoVerificadorReal;
};

// export const isDataComplete = (rowData: any, objectKeys: MasterCRUDColumnObjectKeys[]) => {
//     return objectKeys.every(key => {
//       const value = rowData[key.key];
//       return value !== null && value !== undefined && value !== '';
//     });
//   }

const isEmptyValue = (value: any): boolean => {
  return value === null || value === undefined || value === "";
};

/**
 * Función para verificar si todos los campos están completos según las validaciones internas
 * @param rowData - Datos de la fila actual
 * @param objectKeys - Claves a verificar en la fila
 * @returns boolean - Indica si los campos especificados cumplen con las validaciones
 */
export const isDataComplete = (
  rowData: any,
  objectKeys: MasterCRUDColumnObjectKeys[]
): boolean => {
  // Definir validaciones personalizadas por campo dentro de la función
  const fieldValidations: Record<string, (value: any) => boolean> = {
    code: (value) => !isEmptyValue(value),
    beneficiaryType: (value) => !isEmptyValue(value),
    businessName: (value) => !isEmptyValue(value),
    cuit: (value) => validateCUIT(value),
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    // address: (value) => !isEmptyValue(value),
    // province: (value) => !isEmptyValue(value),
    // city: (value) => !isEmptyValue(value),
    // postalCode: (value) => !isEmptyValue(value),
    // phone: (value) => !isEmptyValue(value),
    // contact: (value) => !isEmptyValue(value),
    // position: (value) => !isEmptyValue(value),
  };

  // Filtrar las keys que tienen una validación definida
  const keysToValidate = objectKeys.filter((key) => fieldValidations[key.key]);

  // Verificar que todos los campos con validaciones estén completos
  return keysToValidate.every((key) => {
    const value = rowData[key.key];
    return fieldValidations[key.key](value);
  });
};


export interface FieldValidation {
    name: string;
    value: any;
  }
  
/**
 * Función para verificar si los campos específicos están completos
 * @param fields - Array de campos con su nombre y valor
 * @returns boolean - true si todos los campos cumplen con las validaciones, false en caso contrario
 */
export const individualTableisDataComplete = (fields: FieldValidation[]): boolean => {
    // Definir las validaciones para cada campo
    const fieldValidations: Record<string, (value: any) => boolean> = {
      cuit: (value) => !isEmptyValue(value) && validateCUIT(value),
      cbuType: (value) => !isEmptyValue(value),
      CBU: (value) => !isEmptyValue(value) && validateCBU(value),
      alias: (value) => !isEmptyValue(value),
      holder: (value) => !isEmptyValue(value),
      bank: (value) => !isEmptyValue(value),
      accountType: (value) => !isEmptyValue(value),
      number: (value) => !isEmptyValue(value),
      type: (value) => !isEmptyValue(value),
    };
  
    // Obtener el valor de 'credicoop'
    const credicoopField = fields.find(field => field.name === 'credicoop');
    const credicoop = credicoopField ? credicoopField.value : false; // Por defecto a false si no se encuentra
  
    // Filtrar los campos que tienen una validación definida
    let fieldsToValidate = fields.filter(field => fieldValidations[field.name]);
  
    // Aplicar validaciones condicionales basadas en 'credicoop'
    if (credicoop === false) {
      // Si credicoop es false, validar 'CBU' y excluir 'number'
      fieldsToValidate = fieldsToValidate.filter(field => field.name !== 'number');
    } else if (credicoop === true) {
      // Si credicoop es true, validar 'number' y excluir 'CBU'
      fieldsToValidate = fieldsToValidate.filter(field => field.name !== 'CBU');
      fieldsToValidate = fieldsToValidate.filter(field => field.name !== 'cbuType');
    }
  
    // Verificar que todos los campos filtrados cumplan con sus respectivas validaciones
    console.log("campos a validar",fieldsToValidate)
    return fieldsToValidate.every(field => fieldValidations[field.name](field.value));
  };