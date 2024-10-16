interface Translations 
{
    [key: string]: { [key: string]: string };
}

const translates: Translations = 
{
    es: 
    {
        signIn: "Inicio de sesión",
        signOut: "Cierre de sesión",
        createOrder: "Creó una orden",
        deleteOrder: "Eliminó una orden",
        deleteForce: "Eliminó permanentemente una orden",
        undoOrder: "Restauró una orden",
        updateOrder: "Actualizó una orden",
        "The Cbu entered is not valid": "El CBU ingresado no es válido",
    },
};

export const getTranslate = (palabra: string): string => 
{
    if (!translates["es"].hasOwnProperty(palabra))
    {
        alert("No se encontró la traducción para la palabra: " + palabra);
        return "unknown";
    }
    
    return translates["es"][palabra];
}
