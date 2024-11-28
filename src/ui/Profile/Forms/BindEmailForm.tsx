import { VerificationCodeInput } from "@/components/VerificationCodeInput";
import useSPETranslation from "@/hooks/useSPETranslation";
import { sendVerifyCode, updateUserApi } from "@/services/apis";
import authStore from "@/store/auth";
import { UserUpdateType } from "@/types";
import { error, success } from "@/utils/notifications";
import {
  Alert,
  Box,
  Button,
  Center,
  SimpleGrid,
  Space,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { IconInfoCircle } from "@tabler/icons-react";
import { useCallback, useState } from "react";

export function BindEmailForm() {
  const t = useSPETranslation();
  const { me } = authStore();

  return (
    <>
      <Button
        onClick={() =>
          modals.open({
            title: me?.email ? t("Change Email") : t("Add Email"),
            children: <EmailBindingModal />,
            centered: true,
          })
        }
        variant="gradient"
        miw={150}
        px={"xs"}
        fullWidth
        disabled={!!me?.email}
        gradient={{ from: "orange", to: "yellow", deg: 90 }}
      >
        {me?.email ? t("Configured") : t("Add Email")}
      </Button>
    </>
  );
}

function EmailBindingModal() {
  const t = useSPETranslation();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      newEmail: "",
      newEmailVerificationCode: "",
    },
    validate: {
      newEmail: (value) => {
        if (!value) {
          return t("Required");
        }
        if (!/^\S+@\S+\.\S+$/.test(value)) {
          return t("Invalid Email");
        }
        return null;
      },
      newEmailVerificationCode: (value) => {
        if (!value) {
          return t("Required");
        }
        if (!/^\d{6}$/.test(value)) {
          return t("Invalid verification code");
        }
        return null;
      },
    },
  });

  const onSubmit = useCallback(async () => {
    form.validate();
    if (!form.isValid()) {
      return;
    }
    setLoading(true);
    const values = form.getValues();
    const res = await updateUserApi(UserUpdateType.ADD_EMAIL, values);
    if (res.data?.result?.success) {
      success(
        t("Bind Email Success"),
        t("Email Has Been Bind Successfully"),
      );
    } else {
      error(
        t("Bind Email Failed"),
        t(t("Something went wrong, can't bind email")),
      );
    }
    setTimeout(() => {
      window.location.href = "/user";
    }, 1000);
  }, [form, t]);

  const send = useCallback(() => {
    const newEmail = form.getValues().newEmail;
    newEmail && sendVerifyCode("EMAIL", { newEmail });
  }, [form]);

  return (
    <Center h={"100%"}>
      <Box>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <SimpleGrid
            cols={1}
            styles={{ container: { gap: "10px" } }}
          >
            <Alert
              variant="light"
              color="primary"
              icon={<IconInfoCircle />}
            >
              {t(
                "The withdrawal function will be disabled for 24 hours after you change your email.",
              )}
            </Alert>
            <TextInput
              label={t("New Email")}
              {...form.getInputProps("newEmail")}
            />
            <VerificationCodeInput
              onclick={send}
              label={t("New Email Verification Code")}
              rightSectionWidth={60}
              key={form.key("newEmailVerificationCode")}
              {...form.getInputProps("newEmailVerificationCode")}
            />
            <Space />
            <Box>
              <Button
                size="lg"
                color="gray"
                variant="gradient"
                disabled={loading}
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
