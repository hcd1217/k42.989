const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatCurrency(
  value: number,
  decimalPlaces: number = 2,
) {
  if (value === 0) {
    return "0";
  }

  const formattedValue = value.toFixed(decimalPlaces);
  return currencyFormatter.format(Number(formattedValue));
}
