import Decimal from "decimal.js";

export function formatCurrency(num: number | string) {
  const decimal = new Decimal(num ?? "0");

  if (decimal.greaterThanOrEqualTo(1e12)) {
    return (
      decimal.dividedBy(1e12).toFixed(3).replace(/\.0$/, "") + "T"
    );
  } else if (decimal.greaterThanOrEqualTo(1e9)) {
    return (
      decimal.dividedBy(1e9).toFixed(3).replace(/\.0$/, "") + "B"
    );
  } else if (decimal.greaterThanOrEqualTo(1e6)) {
    return (
      decimal.dividedBy(1e6).toFixed(3).replace(/\.0$/, "") + "M"
    );
  } else if (decimal.greaterThanOrEqualTo(1e3)) {
    return (
      decimal.dividedBy(1e3).toFixed(3).replace(/\.0$/, "") + "K"
    );
  } else {
    return decimal.toString();
  }
}
