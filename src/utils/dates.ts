export const formatDate = (date: string) => {
  // Asumimos que la entrada es en formato "aaaa-mm-dd"
  const [year, month, day] = date.split('-');

  // Formatea la fecha a dd/mm/aaaa
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
};