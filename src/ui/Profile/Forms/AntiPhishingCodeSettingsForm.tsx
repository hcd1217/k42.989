import useSPETranslation from "@/hooks/useSPETranslation";
import useSPEUserSettings from "@/hooks/useSPEUserSettings";
import { sendVerifyCode } from "@/services/apis";
import logger from "@/services/logger";
import authStore from "@/store/auth";
import { error } from "@/utils/notifications";
import { _validateVerificationCode } from "@/utils/validates";
import {
  Alert,
  Box,
  Button,
  Center,
  Flex,
  SimpleGrid,
  Space,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { IconInfoCircle } from "@tabler/icons-react";
import { z } from "zod";

export function AntiPhishingCodeSettingsForm() {
  const t = useSPETranslation();
  const openModal = () => {
    return modals.open({
      title: t("Anti-Phishing Code Settings"),

      children: <AntiPhishingCodeSettingsModal />,
      centered: true,
    });
  };
  return (
    <>
      <Button
        onClick={openModal}
        variant="gradient"
        miw={150}
        px={"xs"}
        gradient={{ from: "orange", to: "yellow", deg: 90 }}
      >
        {t("Settings")}
      </Button>
    </>
  );
}

type AntiPhishingCodeSettingsFormType = {
  antiPhishingCode: string;
  verificationCode?: string;
  mfaCode?: string;
};
export function AntiPhishingCodeSettingsModal() {
  const {
    loading,
    submit,
    seconds1,
    setSeconds1,
    interval1,
    SECONDS,
  } = useSPEUserSettings<AntiPhishingCodeSettingsFormType>(
    "UPDATE_ANTI_PHISHING_CODE",
  );
  const t = useSPETranslation();
  const { me } = authStore();

  const form = useForm<AntiPhishingCodeSettingsFormType>({
    mode: "uncontrolled",
    initialValues: {
      antiPhishingCode: "",
      verificationCode: me?.hasMfa ? undefined : "",
      mfaCode: me?.hasMfa ? "" : undefined,
    },
    validate: {
      mfaCode: me?.hasMfa ? _validateVerificationCode : undefined,
      verificationCode: me?.hasMfa
        ? undefined
        : _validateVerificationCode,
      antiPhishingCode: (value) => {
        try {
          z.string().min(2).max(20).parse(value);
          return null;
        } catch (error) {
          logger.error(error);
          return t("Invalid anti phishing code");
        }
      },
    },
  });

  const startSending = () => {
    setSeconds1(SECONDS);
    sendVerifyCode("UPDATE_ANTI_PHISHING_CODE").then((res) => {
      if (res.data?.result?.success) {
        interval1.start();
      } else {
        error(
          t("Verification Phishing Code Failed"),
          t(
            "There was an error sending the verification code. Please try again or contact support if the issue persists.",
          ),
        );
      }
    });
  };

  return (
    <Center h={"100%"}>
      <Box>
        <form onSubmit={(e) => submit(e, form)}>
          <SimpleGrid
            cols={1}
            styles={{
              container: {
                gap: "10px",
              },
            }}
          >
            <Alert
              variant="light"
              color="primary"
              icon={<IconInfoCircle />}
            >
              {t(
                "Your unique Anti-Phishing Code will be displayed on all %s emails.",
                localStorage.__APP_NAME__,
              )}
            </Alert>
            <TextInput
              label={t("Anti-Phishing Code")}
              description={t(
                "Enter numbers and letters only. 20 characters max.",
              )}
              key={form.key("antiPhishingCode")}
              {...form.getInputProps("antiPhishingCode")}
            />
            <TextInput
              style={{ display: me?.hasMfa ? undefined : "none" }}
              label={t("Google Authentication")}
              rightSectionWidth={60}
              key={form.key("mfaCode")}
              {...form.getInputProps("mfaCode")}
            />
            <TextInput
              style={{ display: me?.hasMfa ? "none" : undefined }}
              label={t("Current Email Verification")}
              rightSectionWidth={60}
              rightSection={
                <Flex px={10} w={"100%"}>
                  <Button
                    disabled={interval1.active}
                    p={0}
                    variant="transparent"
                    onClick={startSending}
                  >
                    {!interval1.active && t("Send")}
                    {interval1.active && `${seconds1}s`}
                  </Button>
                </Flex>
              }
              key={form.key("verificationCode")}
              {...form.getInputProps("verificationCode")}
            />
            <Space />
            <Box>
              <Button
                loading={loading}
                disabled={loading}
                size="lg"
                color="gray"
                variant="gradient"
                gradient={{ from: "primary", to: "yellow", deg: 90 }}
                fullWidth
                type="submit"
              >
                {t("Confirm")}
              </Button>
            </Box>
          </SimpleGrid>
        </form>
      </Box>
    </Center>
  );
}
