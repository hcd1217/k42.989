import BN from "@/common/big-number";

type NumberFormatProps = {
  decimalPlaces?: number;
  hidden?: boolean;
  prefix?: string;
  suffix?: string;
  zeroAsEmpty?: boolean;
  value: string | number | undefined;
};

export default function NumberFormat({
  decimalPlaces = 2,
  hidden,
  prefix = "",
  suffix = "",
  value,
  zeroAsEmpty = false,
}: NumberFormatProps) {
  if (hidden) {
    return <span>****</span>;
  }
  if (!value) {
    return "--";
  }
  if (zeroAsEmpty && BN.eq(value || 0, 0)) {
    return "--";
  }
  return (
    <span>
      {`${prefix}${BN.format(value || 0, decimalPlaces)} ${suffix}`}
    </span>
  );
}
