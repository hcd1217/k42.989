import { cleanObj } from "@/common/utils";
import MfaForm from "@/components/2FA";
import useSPETranslation from "@/hooks/useSPETranslation";
import { checkMfa, login } from "@/services/apis";
import logger from "@/services/logger";
import { error, success } from "@/utils/notifications";
import {
  convertToInternationalFormatPhoneNumber,
  debounceBuilder,
} from "@/utils/utility";
import { Box, Button, PasswordInput, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import classes from "./login.module.scss";

const baseSchema = z.object({
  email: z.string().optional(),
  mobile: z.string().optional(),
  password: z.string(),
  region: z.string().optional(),
  mfaCode: z.string().optional(),
});

export default function LoginForm({
  onSuccess,
}: {
  onSuccess: (res: {
    token: string;
    userId?: string;
    forceChangePassword?: boolean;
  }) => void;
}) {
  const t = useSPETranslation();
  const [mfaRequired, setMfaRequired] = useState(false);

  const formSchema = useMemo(() => {
    return baseSchema.extend({
      email: z
        .string()
        .trim()
        .min(1, { message: t("Field is required") })
        .email({ message: t("Invalid Email") }),
    });
  }, [t]);

  const form = useForm<z.infer<typeof baseSchema>>({
    initialValues: {
      email: "",
      password: "",
      mfaCode: "",
      region: "",
    },
    validate: zodResolver(formSchema),
    transformValues,
  });

  useEffect(() => {
    const data = transformValues(form.values);
    const email = data.email;
    const password = data.password;

    if (
      email &&
      formSchema.safeParse({
        email: email,
        password: password,
      }).success
    ) {
      checkMfaRequirement({
        email: form.values.email,
        toggle: setMfaRequired,
      });
    }
  }, [
    form.values.email,
    form.values.password,
    formSchema,
    form.values,
  ]);

  const onSubmit = useCallback(async () => {
    try {
      const values = transformValues(form.getValues());
      const result = await login(
        values as z.infer<typeof formSchema>,
      );
      modals.closeAll();
      success(t("Success"), t("Login Success"));
      onSuccess(result);
    } catch (e) {
      error(
        t("Log In Failed"),
        t((e as Error)?.message || "An unexpected error occurred"),
      );
      logger.debug(e);
    }
  }, [form, t, onSuccess]);

  const handleSubmit = useCallback(() => {
    if (mfaRequired) {
      modals.open({
        title: t("Two-factor authentication"),
        withCloseButton: false,
        children: (
          <MfaForm
            onSubmit={(value) => {
              form.setFieldValue("mfaCode", value);
              onSubmit();
            }}
          />
        ),
        centered: true,
      });

      return;
    }
    onSubmit();
  }, [form, mfaRequired, onSubmit, t]);

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Box className={classes.form_container}>
        <TextInput
          withAsterisk
          label={t("Mail address")}
          placeholder={t("Mail address")}
          classNames={{ error: classes.error }}
          {...form.getInputProps("email")}
        />
        <PasswordInput
          withAsterisk
          label={t("Password")}
          placeholder={t("Password")}
          type="password"
          classNames={{ error: classes.error }}
          {...form.getInputProps("password")}
        />
        <Button type="submit">{t("Login")}</Button>
      </Box>
    </form>
  );
}

const checkMfaRequirement = debounceBuilder(
  ({
    email,
    toggle,
  }: {
    email?: string;
    phone?: string;
    toggle: (v: boolean) => void;
  }) => {
    if (email) {
      try {
        checkMfa({ email })
          .then(({ hasMfa }) => toggle(hasMfa))
          .catch((e) => {
            logger.debug(e);
          });
      } catch (e: unknown) {
        logger.debug(e);
      }
    }
  },
  300,
);

type LoginForm = {
  email?: string;
  mobile?: string;
  password: string;
  mfaCode?: string;
  region?: string;
};

function transformValues(values: LoginForm) {
  return cleanObj({
    email: values.email?.toString().trim() || undefined,
    mobile:
      convertToInternationalFormatPhoneNumber({
        phone: values.mobile?.toString().trim(),
        phoneLocale: values.region || "+81 Japan",
      }) || undefined,
    password: values.password.toString().trim(),
    mfaCode: values.mfaCode?.toString().trim(),
    region: values.region?.toString().trim(),
  });
}
