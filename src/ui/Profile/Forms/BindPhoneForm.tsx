import { PHONE_CODE_IMAGE } from "@/common/phone-code";
import useSPETranslation from "@/hooks/useSPETranslation";
import useSPEUserSettings from "@/hooks/useSPEUserSettings";
import { sendVerifyCode } from "@/services/apis";
import authStore from "@/store/auth";
import phoneCode from "@/ui/Form/widgets/mocks/phone-code.json";
import { error } from "@/utils/notifications";
import { extractPhoneNumber, maskEmail } from "@/utils/utility";
import {
  emailVerificationCodeValidate,
  requiredFieldValidate,
} from "@/utils/validates";
import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  InputLabel,
  NumberInput,
  Select,
  SimpleGrid,
  Space,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import { useMemo, useState } from "react";

export function BindPhoneForm() {
  const t = useSPETranslation();
  const openModal = () => {
    return modals.open({
      title: t("Bind Phone"),
      children: <BindPhoneModal />,
      centered: true,
      withinPortal: true,
      size: "lg",
    });
  };
  return (
    <>
      <Button
        onClick={openModal}
        variant="gradient"
        miw={150}
        px={"xs"}
        disabled
        gradient={{ from: "orange", to: "yellow", deg: 90 }}
      >
        {t("Bind Phone")}
      </Button>
    </>
  );
}
export function BindPhoneModal() {
  const {
    submit,
    loading,
    interval1,
    SECONDS,
    interval2,
    seconds1,
    setSeconds1,
    seconds2,
    setSeconds2,
  } = useSPEUserSettings<{
    emailVerificationCode: string;
    mobileVerificationCode: string;
    mobile: string;
  }>("ADD_MOBILE");
  const t = useSPETranslation();
  const { me } = authStore();

  const [region, setRegion] = useState("+81 Japan");

  const info = useMemo(() => {
    return phoneCode.find((v) => v.value === region);
  }, [region]);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      emailVerificationCode: "",
      mobileVerificationCode: "",
      mobile: "",
    },
    // validateInputOnChange: true,

    validate: {
      emailVerificationCode: (value) => {
        try {
          emailVerificationCodeValidate().parse(value);
          return null;
        } catch (error: unknown) {
          if (
            typeof error === "object" &&
            error !== null &&
            "errors" in error
          ) {
            const customError = error as {
              errors: { message: string }[];
            };
            return customError.errors[0].message;
          } else {
            return t("Invalid mobile verification code");
          }
        }
      },
      mobile: (value) => {
        try {
          requiredFieldValidate().parse(value.toString());
          return null;
        } catch (error: unknown) {
          if (
            typeof error === "object" &&
            error !== null &&
            "errors" in error
          ) {
            const customError = error as {
              errors: { message: string }[];
            };
            return customError.errors[0].message;
          } else {
            return t("Invalid mobile verification code");
          }
        }
      },
      mobileVerificationCode: (value) => {
        try {
          emailVerificationCodeValidate().parse(value);
          return null;
        } catch (error: unknown) {
          if (
            typeof error === "object" &&
            error !== null &&
            "errors" in error
          ) {
            const customError = error as {
              errors: { message: string }[];
            };
            return customError.errors[0].message;
          } else {
            return t("Invalid mobile verification code");
          }
        }
      },
    },
  });

  const values = useMemo(() => {
    const { emailVerificationCode, mobile, mobileVerificationCode } =
      form.getValues();
    const formData = {
      emailVerificationCode,
      mobile,
      mobileVerificationCode,
    };
    formData.mobile = extractPhoneNumber({
      mobile: mobile.toString(),
      phoneLocale: region,
    });
    return formData;
  }, [form, region]);

  const startSending = () => {
    if (form.validateField("mobile").hasError) {
      form.setFieldError("mobile", t("Please enter mobile first"));
      return;
    }
    setSeconds1(SECONDS);
    sendVerifyCode("MOBILE").then((res) => {
      if (res.data?.result?.success) {
        interval1.start();
      } else {
        error(
          t("Verification Phone Code Failed"),
          t("There was an error sending the verification code."),
        );
      }
    });
  };

  const startSendingMail = () => {
    setSeconds2(SECONDS);
    sendVerifyCode("EMAIL").then((res) => {
      if (res.data?.result?.success) {
        interval2.start();
      } else {
        error(
          t("Verification Email Code Failed"),
          t("There was an error sending the verification code."),
        );
      }
    });
  };

  return (
    <Center h={"100%"} w={"100%"}>
      <Box w={"100%"}>
        <form onSubmit={(e) => submit(e, form, values)}>
          <SimpleGrid
            cols={1}
            styles={{
              container: {
                gap: "10px",
              },
            }}
          >
            <Box>
              <InputLabel size="lg">{t("Phone Number")}</InputLabel>
              <Flex gap={10}>
                <Box>
                  <Box w={200}>
                    <Select
                      defaultValue={region}
                      data={phoneCode}
                      value={region}
                      onChange={(v) => setRegion(v as string)}
                      leftSection={
                        <Image w={20} src={info?.image}></Image>
                      }
                      leftSectionWidth={40}
                      searchable
                      comboboxProps={{
                        withinPortal: true,
                        width: "300px",

                        position: "bottom-start",
                      }}
                      styles={{
                        input: {
                          fontSize: "14px",
                        },
                      }}
                      rightSectionWidth={30}
                      rightSection={<IconChevronDown size={16} />}
                      renderOption={({ option, checked }) => (
                        <Flex
                          h={"100%"}
                          align={"center"}
                          gap={10}
                          w={"100%"}
                        >
                          <Box>
                            <Image
                              w={20}
                              src={PHONE_CODE_IMAGE[option.value]}
                            />
                          </Box>
                          <Text fz={12}>{option.label}</Text>
                          <Flex ml={"auto"} justify={"end"} flex={1}>
                            {checked && (
                              <IconCheck
                                style={{ marginInlineStart: "auto" }}
                              />
                            )}
                          </Flex>
                        </Flex>
                      )}
                      size="lg"
                      allowDeselect={false}
                    />
                  </Box>
                </Box>
                <Box flex={1}>
                  <NumberInput
                    hideControls
                    placeholder={t("Phone number")}
                    key={form.key("mobile")}
                    {...form.getInputProps("mobile")}
                  />
                </Box>
              </Flex>
            </Box>
            <TextInput
              label={t("SMS Verification")}
              placeholder={t("Enter code")}
              rightSectionWidth={60}
              rightSection={
                <Flex px={10} w={"100%"}>
                  <Button
                    disabled={
                      interval1.active ||
                      form.getInputProps("mobile").error
                    }
                    p={0}
                    variant="transparent"
                    onClick={startSending}
                  >
                    {!interval1.active && t("Send")}
                    {interval1.active && `${seconds1}s`}
                  </Button>
                </Flex>
              }
              key={form.key("mobileVerificationCode")}
              {...form.getInputProps("mobileVerificationCode")}
            />

            <Box>
              <Flex justify={"space-between"} align={"end"}>
                <InputLabel size="lg">
                  {t("Current Email Verification")}
                </InputLabel>
                <Text c={"dimmed"}>{`${maskEmail(
                  me?.email ?? "",
                )}`}</Text>
              </Flex>
              <TextInput
                rightSectionWidth={60}
                rightSection={
                  <Flex px={10} w={"100%"}>
                    <Button
                      disabled={interval2.active}
                      p={0}
                      variant="transparent"
                      onClick={startSendingMail}
                    >
                      {!interval2.active && t("Send")}
                      {interval2.active && `${seconds2}s`}
                    </Button>
                  </Flex>
                }
                placeholder={t("Enter code")}
                key={form.key("emailVerificationCode")}
                {...form.getInputProps("emailVerificationCode")}
              />
            </Box>
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
