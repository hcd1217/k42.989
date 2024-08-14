import useSPEUserSettings from "@/hooks/useSPEUserSettings";
import { sendVerifyCode } from "@/services/apis";
import logger from "@/services/logger";
import authStore from "@/store/auth";
import { error } from "@/utils/notifications";
import { maskEmail, maskPhone } from "@/utils/utility";
import {
  emailVerificationCodeValidate,
  requiredFieldValidate,
} from "@/utils/validates";

import {
  Box,
  Button,
  Flex,
  Space,
  Text,
  TextInput,
  Timeline,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import QRCode from "qrcode.react";
import { useEffect } from "react";

export function ReBindGaForm() {
  const {
    setSeconds1,
    seconds1,
    interval1,
    SECONDS,
    submit,
    loading,
    t,
    generateMfaLink,
    otpAuth,
  } = useSPEUserSettings<{
    oldMfaCode: string;
    mfaCode: string;
    verificationCode: string;
    mfaSecret: string;
  }>("UPDATE_MFA");

  useEffect(() => {
    generateMfaLink();
  }, [generateMfaLink]);

  const { me } = authStore();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      oldMfaCode: "",
      mfaCode: "",
      mfaSecret: "",
      verificationCode: "",
    },

    validate: {
      verificationCode: (value) => {
        try {
          emailVerificationCodeValidate().parse(value);
          return null;
        } catch (error) {
          logger.error(error);
          return "Invalid code";
        }
      },
      oldMfaCode: (value) => {
        try {
          emailVerificationCodeValidate().parse(value);
          return null;
        } catch (error) {
          logger.error(error);
          return "Invalid code";
        }
      },
      mfaCode: (value) => {
        try {
          emailVerificationCodeValidate().parse(value);
          return null;
        } catch (error) {
          logger.error(error);
          return "Invalid code";
        }
      },
      mfaSecret: (value) => {
        try {
          requiredFieldValidate().parse(value);
          return null;
        } catch (error) {
          logger.error(error);
          return "Invalid code";
        }
      },
    },
  });
  const startSending = () => {
    setSeconds1(SECONDS);
    sendVerifyCode(me?.email ? "EMAIL" : "MOBILE").then((res) => {
      if (res.data?.result?.success) {
        interval1.start();
      } else {
        error(
          t("Verification Email Code Failed"),
          t("There was an error sending the verification code."),
        );
      }
    });
  };

  return (
    <>
      <Box py={40}>
        <Title order={2}>{t("Change Google Authenticator")}</Title>
        <Text c={"primary"} fz={14}>
          {t(
            "The withdrawal function will be disabled for 24 hours after you change your Google Authenticator.",
          )}
        </Text>
        <Space my={"xl"} />
        <Timeline
          bulletSize={24}
          lineWidth={1}
          styles={{
            itemBullet: {
              background: "light-dark(black, white)",
            },
            itemTitle: {
              transform: "translateY(-3px)",
            },
          }}
        >
          <Timeline.Item
            styles={{
              itemTitle: {
                marginBottom: "20px",

                lineHeight: "0",
              },
            }}
            title={
              <Box mb={20}>
                <Title order={3}>
                  {t("Set Up New Google Authenticator")}
                </Title>
              </Box>
            }
            bullet={
              <Text
                styles={{
                  root: {
                    color: "light-dark(white, black)",
                  },
                }}
                fw={"bold"}
              >
                1
              </Text>
            }
          >
            <Flex gap={50}>
              <Box>
                <QRCode value={otpAuth.value} size={120} />
              </Box>
              <Box maw={"485px"} w={"100%"}>
                <Text fz={14}>
                  {t(
                    "Launch Google Authenticator app and scan the QR code or enter the key.",
                  )}
                </Text>
                <Text fz={14}>
                  {t("Setup key")}:{" "}
                  <strong
                    style={{
                      borderBottom: "solid 1px",
                    }}
                  >
                    {otpAuth.secret}
                  </strong>
                </Text>
                <Space my={"sm"} />
                <Text c={"primary"} fz={14}>
                  {t(`Write down your setup key in somewhere safe so that
                  you can regain access to your authenticator app if
                  you lose or switch your phone.`)}
                </Text>
              </Box>
            </Flex>
          </Timeline.Item>
          <Timeline.Item
            title={
              <Box mb={20}>
                <Title order={3} mb={"20px"}>
                  {t("Verification")}{" "}
                </Title>
              </Box>
            }
            bullet={
              <Text
                styles={{
                  root: {
                    color: "light-dark(white, black)",
                  },
                }}
                fw={"bold"}
              >
                2
              </Text>
            }
          >
            <Box
              style={{
                maxWidth: "500px",
                width: "100%",
              }}
            >
              <TextInput
                label={t("New Google Authenticator Code")}
                placeholder={t("Enter 6-digit code")}
                key={form.key("mfaCode")}
                {...form.getInputProps("mfaCode")}
              />
            </Box>
          </Timeline.Item>
          <Timeline.Item
            title={
              <Box mb={20}>
                <Title order={3}>{t("Security Verification")}</Title>
              </Box>
            }
            bullet={
              <Text
                styles={{
                  root: {
                    color: "light-dark(white, black)",
                  },
                }}
                fw={"bold"}
              >
                3
              </Text>
            }
          >
            <Box
              style={{
                maxWidth: "500px",
                width: "100%",
              }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.setValues({
                    ...form.getValues(),
                    mfaSecret: otpAuth.secret,
                  });
                  submit(e, form);
                }}
              >
                <Box>
                  <Space my={"md"} />
                  <TextInput
                    style={{
                      display: me?.email ? undefined : "none",
                    }}
                    label={`Current Email Verification（${maskEmail(
                      me?.email ?? "",
                    )}）`}
                    placeholder={t("Enter the verification code")}
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
                  <TextInput
                    style={{
                      display: me?.email ? "none" : undefined,
                    }}
                    label={`Current Mobile Verification（${maskPhone(
                      me?.mobile ?? "",
                    )}）`}
                    placeholder={t("Enter the verification code")}
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
                  <Space my={"md"} />
                  <TextInput
                    label={t("Old Google Authentication Code")}
                    placeholder={t("Enter code")}
                    key={form.key("oldMfaCode")}
                    {...form.getInputProps("oldMfaCode")}
                  />
                  <Space my={"md"} />
                  <Button
                    type="submit"
                    loading={loading}
                    disabled={loading}
                    fullWidth
                    variant="gradient"
                    gradient={{
                      from: "primary",
                      to: "yellow",
                      deg: 90,
                    }}
                  >
                    {t("Confirm")}
                  </Button>
                </Box>
              </form>
            </Box>
          </Timeline.Item>
        </Timeline>
      </Box>
    </>
  );
}
