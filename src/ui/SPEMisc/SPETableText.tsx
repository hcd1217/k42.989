import AppText from "@/ui/Text/AppText";
import { Flex } from "@mantine/core";

export function SPETableText({
  value,
  color,
  maw,
}: {
  maw?: number;
  value: string;
  color?: string;
}) {
  return (
    <Flex maw={maw} align={"center"} justify={"start"}>
      <AppText instancetype="WithCellToken" fz={12} c={color}>
        {value}
      </AppText>
    </Flex>
  );
}
