export const validateCBU = (cbu: string): boolean => {
    // Remover cualquier guion del CBU
    const sanitizedCBU = cbu.replace(/-/g, '');

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
    const resultado1 = (calculoDigito1 === 10 ? 0 : calculoDigito1) === digitoVerificador1;

    // Validar la segunda parte (Número de cuenta)
    const multiplicadores2 = [3, 9, 7, 1, 3, 9, 7, 1, 3, 9, 7, 1, 3];
    let suma2 = 0;
    for (let i = 8; i < 21; i++) {
        suma2 += parseInt(sanitizedCBU[i]) * multiplicadores2[i - 8];
    }

    const digitoVerificador2 = parseInt(sanitizedCBU[21]);
    const calculoDigito2 = 10 - (suma2 % 10);
    const resultado2 = (calculoDigito2 === 10 ? 0 : calculoDigito2) === digitoVerificador2;

  
    return resultado1 && resultado2;
};


// 123456781234567890123

export const formatCBU = (cbu:string) => {
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
}

export const validateCUIT = (cuit: string): boolean => {
    // Remover cualquier guion del CUIT
    const sanitizedCUIT = cuit.replace(/-/g, '');

    // Verificar si el CUIT tiene exactamente 11 dígitos y solo contiene números
    if (sanitizedCUIT.length !== 11 || !/^\d+$/.test(sanitizedCUIT)) {
        console.log(sanitizedCUIT.length);
        console.log("false por esto");
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
    console.log(digitoVerificadorCalculado === digitoVerificadorReal);
    return digitoVerificadorCalculado === digitoVerificadorReal;
};
