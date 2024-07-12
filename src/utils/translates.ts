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
    },
};

export const getTranslate = (palabra: string): string => 
{
    if (!translates["es"].hasOwnProperty(palabra))
    {
        console.log("No se encontró la traducción para la palabra: ", palabra)
        return "unknown";
    }
    
    return translates["es"][palabra];
}
