import useSPETranslation from "@/hooks/useSPETranslation";
import { register } from "@/services/apis";
import logger from "@/services/logger";
import { error, success } from "@/utils/notifications";
import { Box, Button, PasswordInput, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useCallback, useMemo, useState } from "react";
import { z } from "zod";
import classes from "./index.module.scss";

export default function Form({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const t = useSPETranslation();
  const [loading, setLoading] = useState(false);

  const formSchemaEmail = useMemo(() => {
    return z.object({
      email: z
        .string()
        .min(1, { message: t("Field is required") })
        .email({ message: t("Invalid Email") }),
      password: z
        .string()
        .min(6, {
          message: t("Must NOT have fewer than 6 characters"),
        })
        .min(1, { message: t("Field is required") }),
      referrerCode: z.string().optional(),
    });
  }, [t]);

  const form = useForm<z.infer<typeof formSchemaEmail>>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(formSchemaEmail),
    transformValues,
  });

  const onSubmit = useCallback(
    async (value: z.infer<typeof formSchemaEmail>) => {
      try {
        setLoading(true);
        await register(value)
          .then(
            (res) =>
              res && success(t("Success"), t("Register Success")),
          )
          .then(onSuccess);
      } catch (e) {
        error(
          t("SIgn Up Failed"),
          (e as Error).message || "An unexpected error occurred",
        );
        logger.debug(e);
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, t],
  );

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Box className={classes.form_container}>
        <TextInput
          withAsterisk
          label={t("Email Address")}
          placeholder={t("Email Address")}
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

        <Button type="submit" loading={loading}>
          {t("Sign Up")}
        </Button>
      </Box>
    </form>
  );
}

type RegisterForm = {
  email: string;
  password: string;
  referrerCode?: string;
};

function transformValues(values: RegisterForm) {
  return {
    email: values.email.toString().trim(),
    password: values.password.toString().trim(),
    referrerCode: values.referrerCode?.toString().trim(),
  };
}
