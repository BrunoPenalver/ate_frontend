export const getPDF = async (id: number) =>
{
    const URL_FILE = `${import.meta.env.VITE_BACKEND_URL}/pdfs/${id}.pdf`;

    const Peticion = await fetch(URL_FILE);

    if(Peticion.status === 404)
        return null

    const Blob = await Peticion.blob();

    const URL = window.URL.createObjectURL(Blob);

    const Link = document.createElement("a");

    Link.href = URL;
    Link.download = `Orden ${id}.pdf`;
    Link.click();
    Link.remove();
}