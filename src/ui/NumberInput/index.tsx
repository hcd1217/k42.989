import { NumberInput as Nb, NumberInputProps } from "@mantine/core";

export default function NumberInput({ ...props }: NumberInputProps) {
  return (
    <>
      <Nb
        step={1}
        min={0}
        inputMode="decimal"
        pattern="[\d\uff10-\uff19]*"
        {...props}
      />
    </>
  );
}
