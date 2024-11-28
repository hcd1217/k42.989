import useSPETranslation from "@/hooks/useSPETranslation";
import { useMemo, useState } from "react";
import phoneCode from "@/ui/Form/widgets/mocks/phone-code.json";
import { Box, Flex, Select, Text, Image } from "@mantine/core";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import { PHONE_CODE_IMAGE } from "@/common/phone-code";

export default function Region({
  region,
  setRegion,
}: {
  region?: string;
  setRegion: (value: string) => void;
}) {
  const t = useSPETranslation();
  const [defaultValue] = useState("+81 Japan");

  const info = useMemo(() => {
    return phoneCode.find(
      (v) => v.value === (region || defaultValue),
    );
  }, [defaultValue, region]);

  return (
    <Select
      withAsterisk
      label={t("Region")}
      defaultValue={defaultValue}
      data={phoneCode}
      value={region || defaultValue}
      onChange={(v) => setRegion(v as string)}
      leftSection={<Image w={20} src={info?.image}></Image>}
      leftSectionWidth={40}
      searchable
      comboboxProps={{
        withinPortal: true,
      }}
      styles={{
        input: {
          fontSize: "14px",
        },
      }}
      rightSectionWidth={30}
      rightSection={<IconChevronDown size={16} />}
      renderOption={({ option, checked }) => (
        <Flex h={"100%"} align={"center"} gap={10} w={"100%"}>
          <Box>
            <Image w={20} src={PHONE_CODE_IMAGE[option.value]} />
          </Box>
          <Text fz={12}>{option.label}</Text>
          <Flex ml={"auto"} justify={"end"} flex={1}>
            {checked && (
              <IconCheck style={{ marginInlineStart: "auto" }} />
            )}
          </Flex>
        </Flex>
      )}
      size="lg"
      allowDeselect={false}
    />
  );
}
