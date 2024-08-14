import useSPETranslation from "@/hooks/useSPETranslation";
import { Center, SegmentedControl, rem } from "@mantine/core";
import { WidgetProps } from "@rjsf/utils";
import { IconMailHeart, IconPhone } from "@tabler/icons-react";

export function TabWidget(props: WidgetProps) {
  const t = useSPETranslation();

  return (
    <>
      <SegmentedControl
        size="sm"
        color="primary"
        transitionDuration={200}
        w={"100%"}
        transitionTimingFunction="linear"
        data={[
          {
            value: "1",
            label: (
              <Center style={{ gap: 10 }}>
                <IconMailHeart
                  style={{ width: rem(16), height: rem(16) }}
                />
                <span>{t("Email")}</span>
              </Center>
            ),
          },
          {
            value: "2",
            label: (
              <Center style={{ gap: 10 }}>
                <IconPhone
                  style={{ width: rem(16), height: rem(16) }}
                />
                <span>{t("Mobile")}</span>
              </Center>
            ),
          },
        ]}
        value={props.value.toString()}
        onChange={(v) => {
          props.onChange(v.toString());
        }}
      />
    </>
  );
}
