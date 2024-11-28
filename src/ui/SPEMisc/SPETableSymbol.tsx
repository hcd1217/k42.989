import AppText from "@/ui/Text/AppText";
import { Flex, Box } from "@mantine/core";

export function SPETableSymbol({
  symbol,
  color,
  miw,
}: {
  miw?: number;
  color: string;
  symbol: string;
}) {
  return (
    <Flex align={"center"} gap={8}>
      <Box bg={color} w={"2px"} h={30} />
      <Box miw={miw}>
        <AppText instancetype="WithCellToken" fz={12}>
          {symbol}
        </AppText>
      </Box>
    </Flex>
  );
}
