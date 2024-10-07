import { useSPEForm } from "@/hooks/useSPEForm";
import useSPETranslation from "@/hooks/useSPETranslation";
import axios from "@/services/apis";
import { SPEResponse } from "@/types";
import { Header } from "@/ui/Header";
import { error, success } from "@/utils/notifications";
import {
  emailValidate,
  passwordValidate,
  requiredValidate,
} from "@/utils/validates";
import {
  Box,
  Button,
  Card,
  Center,
  Container,
  Flex,
  Group,
  PasswordInput,
  SimpleGrid,
  Space,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./index.module.scss";

const Page = () => {
  const t = useSPETranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const api = "/api/password/reset";
  const { form } = useSPEForm<{
    email?: string;
    type?: number;
    password?: string;
    code?: string;
    mfaCode?: string;
  }>({
    initialValues: {
      email: "",
      type: 1,
      password: "",
      code: "",
      mfaCode: "",
    },
    onValuesChange() {
      //
    },
    validate: {
      email: emailValidate,
      password: passwordValidate,
      code: requiredValidate,
    },
  });

  const submit = useCallback(() => {
    if (loading) {
      return;
    }
    setLoading(true);
    axios
      .post<SPEResponse>(api, form.getValues())
      .then((res) => {
        if (res.data.code === 0) {
          success(
            t("Password Reset Successful"),
            t(
              "Your password has been successfully reset. You can now log in with your new password. If you did not request this change, please contact our support team immediately.",
            ),
          );
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        } else {
          error(t("Something went wrong"), res.data.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [t, setLoading, form, navigate, loading]);

  useEffect(() => {
    const searchParams = Object.fromEntries(
      window.location.search
        ?.replace("?", "")
        .split("&")
        .map((el) => el.split("=")),
    );
    const code = searchParams["code"] || "";
    const email = searchParams["email"] || "";
    if (email) {
      form.setFieldValue("email", email);
      form.setFieldValue("code", code);
    }
  }, [form]);

  return (
    <>
      <Flex
        direction={"column"}
        h={"100vh"}
        className={classes.bgGray}
      >
        <Header />
        <Box className={classes.bgGray} flex={1}>
          <Center h={"100%"} w={"100%"}>
            <Container size={"lg"}>
              <Box w={"100%"}>
                <Card radius={"lg"} p={"xl"} w={500}>
                  <Title order={3} style={{ textAlign: "center" }}>
                    {t("Reset Password")}
                  </Title>
                  <Space h={30} />
                  <form onSubmit={form.onSubmit(submit)}>
                    <SimpleGrid cols={1} spacing={20}>
                      <TextInput
                        key={form.key("email")}
                        {...form.getInputProps("email")}
                        withAsterisk={true}
                        label={t("Email")}
                        placeholder={t("Email")}
                      />
                      <PasswordInput
                        key={form.key("password")}
                        {...form.getInputProps("password")}
                        withAsterisk={true}
                        label={t("New Password")}
                        placeholder={t("New Password")}
                      />
                      <TextInput
                        key={form.key("code")}
                        {...form.getInputProps("code")}
                        withAsterisk={true}
                        label={t("Verification Code")}
                        placeholder={t("Verification Code")}
                      />
                    </SimpleGrid>
                    <Space my={"xl"} />
                    <Button
                      disabled={loading}
                      loading={loading}
                      type="submit"
                      fullWidth
                      size="lg"
                      variant="gradient"
                      gradient={{
                        from: "primary",
                        to: "yellow",
                        deg: 90,
                      }}
                    >
                      {t("Submit")}
                    </Button>
                  </form>
                </Card>
                <Group justify="center" my={"lg"}>
                  <div>
                    {t("You already registered?")}{" "}
                    <Text component="a" href="/login" fw={"bold"}>
                      {t("Log In")}
                    </Text>
                  </div>
                </Group>
              </Box>
            </Container>
          </Center>
        </Box>
      </Flex>
    </>
  );
};

export default Page;
