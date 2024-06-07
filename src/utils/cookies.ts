

export const getCookie = (name: string) => 
{
  const cookieArray = document.cookie.split('; ');

  for (let i = 0; i < cookieArray.length; i++) 
  {
    const cookie = cookieArray[i].split('=');
    if (cookie[0] === name) 
      return cookie[1];     
  }
  
  return null;
};

export const setCookie = (name: string, value: string, days: number) =>
{
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}