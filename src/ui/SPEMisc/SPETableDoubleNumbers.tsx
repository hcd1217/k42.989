import BN from "@/common/big-number";
import NumberFormat from "@/ui/NumberFormat";
import AppText from "@/ui/Text/AppText";
import { Flex } from "@mantine/core";
import React from "react";

export function SPETableDoubleNumbers({
  values,
  color,
  separator = "/",
  maw,
  decimalPlaces,
}: {
  maw?: number;
  separator?: string | React.ReactNode;
  values: [string | number, string | number];
  color?: string;
  decimalPlaces?: number;
}) {
  return (
    <Flex maw={maw} align={"center"} justify={"start"}>
      <AppText instancetype="WithCellToken" fz={12} c={color}>
        {BN.eq(values[0] || 0, 0) ? (
          "---"
        ) : (
          <NumberFormat
            decimalPlaces={decimalPlaces}
            value={values[0]}
          />
        )}
        {` ${separator} `}
        {BN.eq(values[1] || 0, 0) ? (
          "---"
        ) : (
          <NumberFormat
            decimalPlaces={decimalPlaces}
            value={values[1]}
          />
        )}
      </AppText>
    </Flex>
  );
}
