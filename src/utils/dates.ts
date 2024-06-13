

export const formatDateCase = (date: string) =>
{
    const dateObj = new Date(date);

    const day = dateObj.getDate().toString().padStart(2, '0');

    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const seconds = dateObj.getSeconds();

    return `${day} - ${hours}:${minutes}:${seconds}`;
}

export const formatDate = (date: string) =>
{
    const dateObj = new Date(date);

    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();

    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const seconds = dateObj.getSeconds().toString().padStart(2, '0');
    

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export const formatTime = (timeInSeconds: number) => 
{
    const isNegative = timeInSeconds < 0;
    const absoluteTime = isNegative ? timeInSeconds * -1 : timeInSeconds;

    const hours = Math.floor(absoluteTime / 3600);
    const minutes = Math.floor((absoluteTime % 3600) / 60);
    const seconds = absoluteTime % 60;

    if(hours > 0)
        return `${isNegative ? "-" : ""} ${hours.toString().padStart(2,"0")}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return `${isNegative ? "-" : ""} ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const formatHHMMSS = (date: string) =>
{
    const dateObj = new Date(date);

    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const seconds = dateObj.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));