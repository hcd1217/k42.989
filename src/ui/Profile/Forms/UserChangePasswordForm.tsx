import useSPEUserSettings from "@/hooks/useSPEUserSettings";
import authStore from "@/store/auth";
import { error } from "@/utils/notifications";
import { passwordSchemaValidate } from "@/utils/validates";
import {
  Alert,
  Box,
  Button,
  Card,
  Center,
  PasswordInput,
  SimpleGrid,
  Space,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconInfoCircle } from "@tabler/icons-react";
import { omit } from "lodash";
import { ZodError } from "zod";

export function UserChangePasswordForm() {
  const { loading, submit, t } = useSPEUserSettings<{
    currentPassword: string;
    password: string;
    newPassword: string;
  }>("UPDATE_PASSWORD", _logout);

  const form = useForm({
    mode: "uncontrolled",
    validateInputOnBlur: true,
    initialValues: {
      currentPassword: "",
      password: "",
      newPassword: "",
    },

    validate: {
      currentPassword: (value) =>
        value.length <= 0 ? t("Please Enter Current Password") : null,
      password: (value) => {
        try {
          passwordSchemaValidate().parse(value);
          return null;
        } catch (e) {
          if (e instanceof ZodError) {
            if (e.formErrors.formErrors.length > 0) {
              return t(e.formErrors.formErrors[0]);
            }
          } else {
            return t("Invalid password");
          }
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

  return (
    <>
      <Center h={"100%"}>
        <Card
          maw={"480px"}
          w={"100%"}
          p={"24px"}
          shadow="0 0 24px 0 rgba(18,18,20,.1)"
          padding="lg"
          radius="25px"
          mx={"auto"}
        >
          <form
            onSubmit={(e) => {
              if (form.values.newPassword !== form.values.password) {
                error(
                  t("Password not match"),
                  t("Password not match"),
                );
                return;
              }
              submit(
                e,
                form,
                omit(form.getValues(), ["newPassword"]),
              );
            }}
          >
            <SimpleGrid
              cols={1}
              styles={{
                container: {
                  gap: "10px",
                },
              }}
            >
              <Title>{t("Reset Password")}</Title>

              <Alert
                variant="light"
                color="primary"
                icon={<IconInfoCircle />}
              >
                {t(
                  "The withdrawal function will be disabled for 24 hours after you change your login password.",
                )}
              </Alert>
              <PasswordInput
                label={t("Current Password")}
                key={form.key("currentPassword")}
                {...form.getInputProps("currentPassword")}
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
        </Card>
      </Center>
    </>
  );
}

function _logout() {
  setTimeout(() => {
    authStore.getState().logout(false);
    window.location.href = "/login";
  }, 2e3);
}
