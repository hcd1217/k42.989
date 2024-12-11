import useSPETranslation from "@/hooks/useSPETranslation";
import { Alert, Box, List, Text } from "@mantine/core";
import { IconCamera } from "@tabler/icons-react";

export function MsgNoticeCapture() {
  const t = useSPETranslation();
  return (
    <Alert
      w={"100%"}
      color={"red"}
      icon={<IconCamera />}
      title={t(
        "Notice: Issues with Direct Document Capture on Mobile Devices",
      )}
    >
      <Box>
        <Text fw={"bold"} mb={"xs"} fz={"sm"}>
          {t(
            "If you are using a mobile phone, you might face issues while capturing documents directly.",
          )}
        </Text>
        <Text fw={"bold"} fz={14} c={"red"}>
          {t("This could be due to:")}
        </Text>
        <List>
          <List.Item>
            <Text fz={14}>{t("Insufficient phone memory.")}</Text>
          </List.Item>
          <List.Item>
            <Text fz={14}>{t("Unstable device performance.")}</Text>
          </List.Item>
          <List.Item>
            <Text fz={14}>
              {t(
                "Technical limitations from the browser or operating system.",
              )}
            </Text>
          </List.Item>
        </List>
        <Text fw={"bold"} fz={14} mt={"sm"} c={"green"}>
          {t("Solution:")}
        </Text>
        <List>
          <List.Item>
            <Text fz={14}>
              {t(
                "Use your phone’s camera app to take photos of the documents first.",
              )}
            </Text>
          </List.Item>
          <List.Item>
            <Text fz={14}>
              {t(
                "Then, upload the saved photos from your gallery to complete the verification process.",
              )}
            </Text>
          </List.Item>
        </List>
      </Box>
    </Alert>
  );
}
