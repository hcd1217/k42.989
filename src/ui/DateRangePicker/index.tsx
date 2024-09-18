import { DatesProvider } from "@mantine/dates";
import "dayjs/locale/en";
import "dayjs/locale/ja";

import useSPETranslation from "@/hooks/useSPETranslation";
import { Language } from "@/services/languages";
import { Flex, MantineStyleProps } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";

const format =
  localStorage.__LANGUAGE__ === Language.JA ? "MM月DD日" : "MM/DD";

export function DateRangePicker({
  value,
  w,
  setValue,
}: {
  w?: MantineStyleProps["w"];
  value?: [Date | null, Date | null];
  setValue?: (v: [Date | null, Date | null]) => void;
}) {
  const t = useSPETranslation();

  return (
    <DatesProvider settings={{}}>
      <Flex align={"center"} gap={10} w={w}>
        <DatePickerInput
          rightSection={<IconCalendar />}
          placeholder={t("Start Date - End Date")}
          w={"100%"}
          size="md"
          type="range"
          value={value}
          onChange={setValue}
          valueFormat={format}
        />
      </Flex>
    </DatesProvider>
  );
}
