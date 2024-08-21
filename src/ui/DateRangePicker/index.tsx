import "dayjs/locale/ja";
import "dayjs/locale/en";
import { DatesProvider } from "@mantine/dates";

import useSPETranslation from "@/hooks/useSPETranslation";
import { Flex } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { Language } from "@/services/languages";

export function DateRangePicker() {
  const t = useSPETranslation();
  const [value, setValue] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const activeLanguage = useMemo(() => {
    return localStorage.__LANGUAGE__;
  }, []);

  const locale = useMemo(() => {
    return activeLanguage === Language.EN ? "en" : "ja";
  }, [activeLanguage]);

  return (
    <DatesProvider settings={{ locale }}>
      <Flex
        align={"center"}
        gap={10}
        w={{
          xs: "100%",
          md: 320,
        }}
      >
        {/* <Title size={16}>{t("Period")}</Title> */}
        <DatePickerInput
          rightSection={
            <>
              <IconCalendar />
            </>
          }
          placeholder={t("Start Date - End Date")}
          w={"100%"}
          size="md"
          type="range"
          value={value}
          onChange={setValue}
        />
      </Flex>
    </DatesProvider>
  );
}
