export const formatPrice = (price: number) =>
{
    return new Intl.NumberFormat('en-DE').format(price);
}