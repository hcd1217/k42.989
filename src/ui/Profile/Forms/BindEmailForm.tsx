import useSPETranslation from "@/hooks/useSPETranslation";
import useSPEUserSettings from "@/hooks/useSPEUserSettings";
import { sendVerifyCode } from "@/services/apis";
import logger from "@/services/logger";
import authStore from "@/store/auth";
import { error } from "@/utils/notifications";
import { maskEmail } from "@/utils/utility";
import {
  antiPhishingCodeValidate,
  emailValidate,
  emailVerificationCodeValidate,
} from "@/utils/validates";
import {
  Alert,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  InputLabel,
  SimpleGrid,
  Space,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import {
  IconAlertCircle,
  IconAsterisk,
  IconDeviceMobile,
  IconInfoCircle,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { BindPhoneModal } from "./BindPhoneForm";

export function BindEmailForm() {
  const t = useSPETranslation();
  const { me } = authStore();

  const openModal = () => {
    if (me?.hasMfa) {
      openModalEmail();
    } else {
      openModalPending();
    }
  };

  const openModalEmail = () => {
    return modals.open({
      title: t("Change Email"),
      children: <EmailBindModal />,
      centered: true,
    });
  };

  const openModalPhone = () => {
    modals.open({
      title: t("Bind Phone"),
      children: <BindPhoneModal />,
      centered: true,
      withinPortal: true,
      size: "lg",
    });
  };

  const openModalPending = () => {
    return modals.open({
      title: t("Pending Security Features"),
      children: (
        <EmailBindModalPending onClickPhone={openModalPhone} />
      ),
      centered: true,
    });
  };

  return (
    <>
      <Button
        onClick={openModal}
        variant="gradient"
        miw={150}
        disabled
        px={"xs"}
        gradient={{ from: "orange", to: "yellow", deg: 90 }}
      >
        {t("Change email")}
      </Button>
    </>
  );
}

export function EmailBindModal() {
  const {
    loading,
    submit,
    me,
    SECONDS,
    t,
    seconds2,
    seconds1,
    setSeconds1,
    setSeconds2,
    interval1,
    interval2,
  } = useSPEUserSettings<{
    email: string;
    newVerificationCode: string;
    verificationCode: string;
    mfaCode: string;
  }>("ADD_EMAIL");

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      newVerificationCode: "",
      verificationCode: "",
      mfaCode: "",
    },
    // validateInputOnChange: true,
    validate: {
      verificationCode: (value) => {
        try {
          emailVerificationCodeValidate().parse(value);
          return null;
        } catch (error) {
          logger.error(error);
          return t("Invalid verification code");
        }
      },
      newVerificationCode: (value) => {
        try {
          emailVerificationCodeValidate().parse(value);
          return null;
        } catch (error) {
          logger.error(error);
          return t("Invalid verification code");
        }
      },
      mfaCode: (value) => {
        try {
          antiPhishingCodeValidate().parse(value);
          return null;
        } catch (error) {
          logger.error(error);
          return t("Invalid MFA code");
        }
      },
      email: (value) => {
        try {
          emailValidate().parse(value);
          return null;
        } catch (error) {
          logger.error(error);
          return t("Invalid email");
        }
      },
    },
  });

  const startSending1 = () => {
    if (form.validateField("email").hasError) {
      form.setFieldError("email", t("Please enter email first"));
      return;
    }
    setSeconds1(SECONDS);
    sendVerifyCode("NEW_EMAIL").then((res) => {
      if (res.data?.result?.success) {
        interval1.start();
      } else {
        error(
          t("Verification New Email Code Failed"),
          t(
            "There was an error sending the verification code. Please try again or contact support if the issue persists.",
          ),
        );
      }
    });
  };

  const startSending2 = () => {
    setSeconds2(SECONDS);
    sendVerifyCode("EMAIL").then((res) => {
      if (res.data?.result?.success) {
        interval2.start();
      } else {
        error(
          t("Verification Current Email Code Failed"),
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
                "The withdrawal function will be disabled for 24 hours after you change your email.",
                localStorage.__APP_NAME__,
              )}
            </Alert>
            <TextInput
              label={t("New Email")}
              key={form.key("email")}
              {...form.getInputProps("email")}
            />
            <TextInput
              label={t("New Email Verification Code")}
              rightSectionWidth={60}
              rightSection={
                <Flex px={10} w={"100%"}>
                  <Button
                    disabled={
                      interval1.active ||
                      Boolean(form.getInputProps("email").error)
                    }
                    p={0}
                    variant="transparent"
                    onClick={startSending1}
                  >
                    {!interval1.active && t("Send")}
                    {interval1.active && `${seconds1}s`}
                  </Button>
                </Flex>
              }
              key={form.key("newVerificationCode")}
              {...form.getInputProps("newVerificationCode")}
            />
            <Space />
            <Divider />
            <Space />
            <TextInput
              label={t("Google Authentication")}
              rightSectionWidth={60}
              key={form.key("mfaCode")}
              {...form.getInputProps("mfaCode")}
            />
            <Space />
            <Box>
              <Flex justify={"space-between"} align={"end"}>
                <InputLabel size="lg">
                  {t("Current Email Verification")}
                </InputLabel>
                <Text c={"dimmed"}>{maskEmail(me?.email || "")}</Text>
              </Flex>
              <TextInput
                rightSectionWidth={60}
                rightSection={
                  <Flex px={10} w={"100%"}>
                    <Button
                      disabled={interval2.active}
                      p={0}
                      variant="transparent"
                      onClick={startSending2}
                    >
                      {!interval2.active && t("Send")}
                      {interval2.active && `${seconds2}s`}
                    </Button>
                  </Flex>
                }
                key={form.key("verificationCode")}
                {...form.getInputProps("verificationCode")}
              />
            </Box>
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

export function EmailBindModalPending(props: {
  onClickPhone?: () => void;
}) {
  const t = useSPETranslation();

  const onClickBindPhone = () => {
    if (props.onClickPhone) {
      props?.onClickPhone();
    }
  };

  return (
    <>
      <Alert icon={<IconAlertCircle />}>
        <Text fz={14}>
          {t(
            "Your account security is weak. Protect your funds by improving account security.",
          )}
        </Text>
      </Alert>
      <Space my={"md"} />
      <Flex gap={10} py={"xs"}>
        <IconAsterisk />
        <Text>{t("Google Authentication")}</Text>
        <Box
          ml={"auto"}
          component={Link}
          onClick={() => modals.closeAll()}
          to={"/user/bind-ga"}
          td={"none"}
        >
          <Text ml={"auto"} c={"primary"}>
            {t("Bind Now")}
          </Text>
        </Box>
      </Flex>
      <Divider my={"xs"} />
      <Flex gap={10} py={"xs"}>
        <IconDeviceMobile />
        <Text>{t("Phone Verification")}</Text>
        <Box
          ml={"auto"}
          onClick={onClickBindPhone}
          td={"none"}
          style={{
            cursor: "pointer",
          }}
        >
          <Text c={"primary"}>{t("Bind Now")}</Text>
        </Box>
      </Flex>
    </>
  );
}
