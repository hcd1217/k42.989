import useSPETranslation from "@/hooks/useSPETranslation";
import Region from "@/ui/SPEMisc/SPERegion";
import { convertToInternationalFormatPhoneNumber } from "@/utils/utility";
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
import { IconMailHeart, IconPhone } from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import { z } from "zod";
import classes from "./index.module.scss";
import logger from "@/services/logger";
import { error, success } from "@/utils/notifications";
import { register } from "@/services/apis";

type Mode = "email" | "phone";

export default function Form({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const t = useSPETranslation();
  const [mode, setMode] = useState<Mode>("email");

  const baseSchema = useMemo(() => {
    return z.object({
      email: z.string().optional(),
      mobile: z.string().optional(),
      password: z
        .string()
        .min(6, {
          message: t("Must NOT have fewer than 6 characters"),
        })
        .min(1, { message: t("Field is required") }),
      region: z.string().optional(),
      referrerCode: z.string().optional(),
    });
  }, [t]);

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
    return mode === "email" ? formSchemaEmail : formSchemaMobile;
  }, [formSchemaEmail, formSchemaMobile, mode]);

  const form = useForm<z.infer<typeof baseSchema>>({
    initialValues: {
      mobile: "",
      email: "",
      password: "",
      region: "",
    },
    validate: zodResolver(formSchema),
    transformValues,
  });

  const onSubmit = useCallback(
    async (value: z.infer<typeof baseSchema>) => {
      try {
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
      }
    },
    [onSuccess, t],
  );

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Box className={classes.form_container}>
        <SegmentedControl
          size="sm"
          color="primary"
          transitionDuration={200}
          w={"100%"}
          transitionTimingFunction="linear"
          value={mode}
          onChange={(value: string) => setMode(value as Mode)}
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

        {mode === "email" ? (
          <TextInput
            withAsterisk
            label={t("Email address")}
            placeholder={t("Email address")}
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

        <Button type="submit">{t("Sign Up")}</Button>
      </Box>
    </form>
  );
}

type RegisterForm = {
  email?: string;
  mobile?: string;
  password: string;
  referrerCode?: string;
  region?: string;
};

function transformValues(values: RegisterForm) {
  return {
    email: values.email?.toString().trim() || undefined,
    mobile:
      convertToInternationalFormatPhoneNumber({
        phone: values.mobile?.toString().trim(),
        phoneLocale: values.region || "+81 Japan",
      }) || undefined,
    password: values.password.toString().trim(),
    referrerCode: values.referrerCode?.toString().trim(),
    region: values.region?.toString().trim(),
  };
}

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
);
