
export const getExportacion = async (id: number) =>
{
    const URL_FILE = `${import.meta.env.VITE_BACKEND_URL}/exports/${id}.txt`;

    const Peticion = await fetch(URL_FILE);

    const Blob = await Peticion.blob();

    const URL = window.URL.createObjectURL(Blob);

    const Link = document.createElement("a");

    Link.href = URL;
    Link.download = `Exportación ${id}.txt`;
    Link.click();
    Link.remove();
}