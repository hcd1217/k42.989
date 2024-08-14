import BN from "@/common/big-number";
import NumberFormat from "@/ui/NumberFormat";
import AppText from "@/ui/Text/AppText";
import { Flex } from "@mantine/core";

export function SPETableNumber({
  value,
  color,
  maw,
  prefix,
  decimalPlaces = 4,
}: {
  prefix?: string;
  decimalPlaces?: number;
  maw?: number;
  value?: string | number;
  color?: string;
}) {
  return (
    <Flex maw={maw} align={"center"} justify={"start"}>
      <AppText instancetype="WithCellToken" fz={12} c={color}>
        {BN.eq(value || 0, 0) ? (
          "---"
        ) : (
          <NumberFormat
            prefix={prefix}
            value={value || 0}
            decimalPlaces={decimalPlaces}
          />
        )}
      </AppText>
    </Flex>
  );
}
