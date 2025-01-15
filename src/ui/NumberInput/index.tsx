import { NumberInput as Nb, NumberInputProps } from "@mantine/core";
// const pt = "[\d\uff10-\uff19]*"
export default function NumberInput({
  value,
  ...props
}: NumberInputProps) {
  return (
    <>
      <Nb
        min={0}
        {...props}
        value={
          value !== undefined
            ? isNaN(parseFloat(value.toString()))
              ? ""
              : value
            : ""
        }
        inputMode="decimal"
        allowDecimal={true}
      />
    </>
  );
}
