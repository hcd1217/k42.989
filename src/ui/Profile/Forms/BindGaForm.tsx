import appStore from "@/assets/Download_on_the_App_Store_Badge.svg.png";
import chPlay from "@/assets/Google_Play_Store_badge_EN.svg.png";
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
  Image,
  Space,
  Text,
  TextInput,
  Timeline,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import QRCode from "qrcode.react";
import { useEffect } from "react";

export function BindGaForm() {
  const {
    t,
    loading,
    setSeconds1,
    interval1,
    seconds1,
    SECONDS,
    submit,
    generateMfaLink,
    otpAuth,
  } = useSPEUserSettings<{
    mfaCode: string;
    mfaSecret: string;
    verificationCode: string;
  }>("ADD_MFA");

  useEffect(() => {
    generateMfaLink();
  }, [generateMfaLink]);

  const { me } = authStore();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      mfaCode: "",
      mfaSecret: otpAuth.secret || "",
      verificationCode: "",
    },
    validate: {
      mfaCode: (value) => {
        try {
          logger.debug("mfaCode", value);
          emailVerificationCodeValidate().parse(value);
          return null;
        } catch (e) {
          logger.error(e);
          return t("Invalid verification code");
        }
      },
      mfaSecret: (value) => {
        try {
          logger.debug("mfaSecret", value);
          requiredFieldValidate().parse(value);
          return null;
        } catch (e) {
          return t("Invalid secret code");
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
            title={
              <Box mb={20}>
                <Title order={3} mb={"20px"}>
                  {t("Download Google Authenticator App")}
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
            <Flex gap={10} align={"start"} h={"50px"}>
              <Box
                h={"100%"}
                component={"a"}
                href="https://apps.apple.com/us/app/google-authenticator/id388497605"
                target="_blank"
              >
                <Image h={"100%"} src={appStore} />
              </Box>
              <Box
                h={"100%"}
                component="a"
                href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en"
                target="_blank"
              >
                <Image h={"100%"} src={chPlay} />
              </Box>
            </Flex>
          </Timeline.Item>
          <Timeline.Item
            styles={{
              itemTitle: {
                marginBottom: "20px",

                lineHeight: "0",
              },
            }}
            title={
              <Box mb={20}>
                <Title order={3}>{t("Setup key")}</Title>
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
            <Flex gap={50}>
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
                    label={t("Google Authenticator Code")}
                    placeholder={t("Enter 6-digit code")}
                    key={form.key("mfaCode")}
                    {...form.getInputProps("mfaCode")}
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
            </Flex>
          </Timeline.Item>
        </Timeline>
      </Box>
    </>
  );
}
