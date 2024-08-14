import AppText from "@/ui/Text/AppText";
import { fmtDate } from "@/utils/utility";
import { Flex } from "@mantine/core";

export function SPETableDateTime({ time }: { time: number }) {
  return (
    <Flex align={"end"}>
      <AppText instancetype="WithCellToken" fz={12}>
        {time ? fmtDate(time) : "---"}
      </AppText>
    </Flex>
  );
}
