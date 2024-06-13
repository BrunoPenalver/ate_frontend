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
    },
};

export const getTranslate = (palabra: string): string => 
{
    if (!translates["es"].hasOwnProperty(palabra)) 
        return "unknown";
    
    return translates["es"][palabra];
}
