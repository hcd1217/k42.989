export function parseNumber(
  input?: string | number,
  isInteger = false,
): number {
  if (!input) {
    return 0;
  }
  if (typeof input === "number") {
    return isInteger ? Math.floor(input) : input;
  }
  const res = isInteger ? parseInt(input) : parseFloat(input);
  return isNaN(res) ? 0 : res;
}
