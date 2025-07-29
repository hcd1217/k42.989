const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatCurrency(
  value: number,
  decimalPlaces: number = 2,
  zeroValue: string = "0",
) {
  if (value === 0) {
    return zeroValue;
  }

  const formattedValue = value.toFixed(decimalPlaces);
  return currencyFormatter.format(Number(formattedValue));
}

export function formatNumber(
  value: number,
  decimalPlaces: number = 2,
  zeroValue: string = "0",
) {
  if (value === 0) {
    return zeroValue;
  }
  const formattedValue = value.toFixed(decimalPlaces);
  return Number(formattedValue).toLocaleString("en-US");
}
