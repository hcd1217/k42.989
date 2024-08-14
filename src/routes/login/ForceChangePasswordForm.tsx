import useSPEUserSettings from "@/hooks/useSPEUserSettings";
import {
  requestChangePasswordApi,
  sendVerifyCode,
} from "@/services/apis";
import { error, success } from "@/utils/notifications";
import { passwordSchemaValidate } from "@/utils/validates";
import {
  Alert,
  Box,
  Button,
  Flex,
  PasswordInput,
  SimpleGrid,
  Space,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconRefreshAlert } from "@tabler/icons-react";
import { omit } from "lodash";
import { FormEvent, useCallback } from "react";

const IS_DEBUG = true;

type PropsType = {
  userId: string;
  onSuccess?: () => void;
};

export function ForceChangePasswordForm(props: PropsType) {
  const {
    loading,
    t,
    interval1,
    setSeconds1,
    seconds1,
    SECONDS,
    setLoading,
  } = useSPEUserSettings<{
    oldPassword: string;
    password: string;
    newPassword: string;
    verificationCode: string;
  }>("UPDATE_PASSWORD");

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      oldPassword: "",
      password: "",
      newPassword: "",
      verificationCode: "",
    },
    // validateInputOnChange: true,

    validate: {
      oldPassword: (value) =>
        value.length <= 0 ? t("Please Enter Old Password") : null,
      password: (value) => {
        try {
          passwordSchemaValidate().parse(value);
          return null;
        } catch (e) {
          return t(
            "Password is 8-20 characters, must contains uppercase and lowercase letters and numbers",
          );
        }
      },
      newPassword: (value, values) => {
        if (value !== values.password) {
          return t(
            "The passwords are inconsistent. Please try again.",
          );
        }
        return null;
      },
    },
  });

  const startSending = () => {
    setSeconds1(SECONDS);
    sendVerifyCode("EMAIL").then((res) => {
      if (res.data?.result?.success) {
        interval1.start();
      } else {
        if (IS_DEBUG) {
          interval1.start();
        } else {
          error(
            t("Verification Email Code Failed"),
            t("There was an error sending the verification code."),
          );
        }
      }
    });
  };

  const submit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (form.isValid() === false) {
        form.validate();
        return false;
      }
      const formData = omit(form.getValues(), ["password"]);

      setLoading(true);
      requestChangePasswordApi({
        ...formData,
        userId: props.userId || "",
      })
        .then((res) => {
          if (res.data?.result?.success) {
            success(
              t("Password Changed Successfully"),
              t(
                "Your password has been changed successfully. Please use your new password to log in next time.",
              ),
            );
            form.setValues(form.values);
            props.onSuccess && props.onSuccess();
            setTimeout(() => {
              window.location.reload();
            }, 500);
          } else {
            error(
              t("Password Change Failed"),
              t(
                "There was an error changing your password. Please try again later or contact support if the issue persists.",
              ),
            );
          }
        })
        .catch(() => {
          if (IS_DEBUG) {
            // todo-v: remove
            success(
              t("Password Changed Successfully"),
              t(
                "Your password has been changed successfully. Please use your new password to log in next time.",
              ),
            );
            localStorage.__FORCE_PASSWORD_CHANGED__ = true;
            props.onSuccess && props.onSuccess();
          } else {
            error(
              t("Password Change Failed"),
              t(
                "There was an error changing your password. Please try again later or contact support if the issue persists.",
              ),
            );
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [form, setLoading, t, props],
  );

  return (
    <>
      <form onSubmit={(e) => submit(e)}>
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
            icon={<IconRefreshAlert />}
          >
            {t(
              "Your account has been synchronized to the new system. To ensure your data is safe and secure, please change your password to continue using the service.",
            )}
          </Alert>
          <PasswordInput
            label={t("Old password")}
            key={form.key("oldPassword")}
            {...form.getInputProps("oldPassword")}
          />
          <PasswordInput
            label={t("New Password")}
            key={form.key("password")}
            {...form.getInputProps("password")}
          />
          <PasswordInput
            label={t("Confirm New Password")}
            key={form.key("newPassword")}
            {...form.getInputProps("newPassword")}
          />
          <TextInput
            style={{ display: "none" }}
            label={t("Verification Code")}
            placeholder={t("Enter code")}
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
              gradient={{
                from: "primary",
                to: "yellow",
                deg: 90,
              }}
              fullWidth
              type="submit"
            >
              {t("Confirm")}
            </Button>
          </Box>
        </SimpleGrid>
      </form>
    </>
  );
}
