import AppText from "@/ui/Text/AppText";
import { Flex } from "@mantine/core";

export function SPETableSide({
  side,
  color,
}: {
  color: string;
  side: string;
}) {
  return (
    <Flex align={"center"}>
      <AppText instancetype="WithCellToken" fz={12} c={color}>
        {side}
      </AppText>
    </Flex>
  );
}
