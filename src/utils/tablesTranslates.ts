const translates = {
  es: {
    date: "Fecha",
    description: "Descripción",
    state: "Estado",
    active: "Activo",
    total: "Total",
    createdAt: "Creada",
    updatedAt: "Actualizada",
    id: "ID",
    orderNumber: "Nº de orden"
  },
};

export const getTranslate = (key: string) => 
{
  if (!translates["es"].hasOwnProperty(key)) 
  {
    console.log(key);
    return "unknown";
  }
  
  // @ts-ignore
  return translates["es"][key];
};
