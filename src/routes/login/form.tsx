import { cleanObj } from "@/common/utils";
import useSPETranslation from "@/hooks/useSPETranslation";
import { checkMfa, login } from "@/services/apis";
import logger from "@/services/logger";
import Region from "@/ui/SPEMisc/SPERegion";
import { error, success } from "@/utils/notifications";
import {
  convertToInternationalFormatPhoneNumber,
  debounceBuilder,
} from "@/utils/utility";
import {
  Box,
  Button,
  Center,
  Grid,
  PasswordInput,
  rem,
  SegmentedControl,
  Space,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import { IconMailHeart, IconPhone } from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import MfaModal from "./2fa";
import classes from "./login.module.scss";

type Mode = "email" | "phone";

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
  const [loginMode, setLoginMode] = useState<Mode>("email");
  const [mfaRequired, setMfaRequired] = useState(false);

  const baseSchema = useMemo(() => {
    return z.object({
      email: z.string().optional(),
      mobile: z.string().optional(),
      password: z.string(),
      region: z.string().optional(),
      mfaCode: z.string().optional(),
    });
  }, []);

  const formSchemaEmail = useMemo(() => {
    return baseSchema.extend({
      email: z
        .string()
        .min(1, { message: t("Field is required") })
        .email({ message: t("Invalid Email") }),
      mobile: z.string().optional(),
    });
  }, [baseSchema, t]);

  const formSchemaMobile = useMemo(() => {
    return baseSchema.extend({
      email: z.string().optional(),
      mobile: z
        .string()
        .regex(phoneRegex, { message: t("Invalid Number!") })
        .min(1, { message: t("Field is required") }),
    });
  }, [baseSchema, t]);

  const formSchema = useMemo(() => {
    return loginMode === "email" ? formSchemaEmail : formSchemaMobile;
  }, [formSchemaEmail, formSchemaMobile, loginMode]);

  const form = useForm<z.infer<typeof baseSchema>>({
    initialValues: {
      mobile: "",
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
    const phone = data.mobile;
    const password = data.password;

    if (
      loginMode === "email" &&
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
    } else if (
      loginMode === "phone" &&
      phone &&
      formSchema.safeParse({
        mobile: phone,
        password: password,
      }).success
    ) {
      checkMfaRequirement({
        phone: phone,
        toggle: setMfaRequired,
      });
    }
  }, [
    loginMode,
    form.values.email,
    form.values.mobile,
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
        (e as Error).message || "An unexpected error occurred",
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
          <MfaModal
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
        <SegmentedControl
          size="sm"
          color="primary"
          transitionDuration={200}
          w={"100%"}
          transitionTimingFunction="linear"
          value={loginMode}
          onChange={(value: string) => setLoginMode(value as Mode)}
          data={[
            {
              value: "email",
              label: (
                <Center style={{ gap: 10 }}>
                  <IconMailHeart
                    style={{ width: rem(16), height: rem(16) }}
                  />
                  <span>{t("Email")}</span>
                </Center>
              ),
            },
            {
              value: "phone",
              label: (
                <Center style={{ gap: 10 }}>
                  <IconPhone
                    style={{ width: rem(16), height: rem(16) }}
                  />
                  <span>{t("Mobile")}</span>
                </Center>
              ),
            },
          ]}
        />

        {loginMode === "email" ? (
          <TextInput
            withAsterisk
            label={t("Mail address")}
            placeholder={t("Mail address")}
            classNames={{ error: classes.error }}
            {...form.getInputProps("email")}
          />
        ) : (
          <>
            <Box hiddenFrom="lg">
              <Region
                region={form.values.region}
                setRegion={(value: string) => {
                  form.setFieldValue("region", value);
                }}
              />
              <Space h={30} />
              <TextInput
                withAsterisk
                label={t("Phone Number")}
                placeholder={t("Phone Number")}
                classNames={{ error: classes.error }}
                {...form.getInputProps("mobile")}
              />
            </Box>
            <Grid visibleFrom="lg">
              <Grid.Col span={5}>
                <Region
                  region={form.values.region}
                  setRegion={(value: string) => {
                    form.setFieldValue("region", value);
                  }}
                />
              </Grid.Col>
              <Grid.Col span={7}>
                <TextInput
                  withAsterisk
                  label={t("Phone Number")}
                  placeholder={t("Phone Number")}
                  classNames={{ error: classes.error }}
                  {...form.getInputProps("mobile")}
                />
              </Grid.Col>
            </Grid>
          </>
        )}

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
    phone,
    toggle,
  }: {
    email?: string;
    phone?: string;
    toggle: (v: boolean) => void;
  }) => {
    let data: { type: 1 | 2; mobile?: string; email?: string };
    if (email) {
      data = { email, type: 1 };
    } else {
      data = { mobile: phone, type: 2 };
    }
    try {
      checkMfa(data)
        .then(({ hasMfa }) => toggle(hasMfa))
        .catch((e) => {
          logger.debug(e);
        });
    } catch (e: unknown) {
      logger.debug(e);
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

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
);
