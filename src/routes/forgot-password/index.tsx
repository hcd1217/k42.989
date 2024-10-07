import { useSPEForm } from "@/hooks/useSPEForm";
import useSPETranslation from "@/hooks/useSPETranslation";
import axios from "@/services/apis";
import { SPEResponse } from "@/types";
import { Header } from "@/ui/Header";
import { error, success } from "@/utils/notifications";
import { emailValidate } from "@/utils/validates";
import {
  Box,
  Button,
  Card,
  Center,
  Container,
  Flex,
  Group,
  Space,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./index.module.scss";

const Page = () => {
  const t = useSPETranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const api = "/api/password/forgot";
  const { form } = useSPEForm<{
    email?: string;
    type?: number;
  }>({
    initialValues: {
      email: "",
      type: 1,
    },
    onValuesChange() {
      //
    },
    validate: {
      email: emailValidate,
    },
  });
  const submit = useCallback(() => {
    setLoading(true);
    axios
      .post<SPEResponse>(api, form.getValues())
      .then((res) => {
        if (res.data.code === 0) {
          success(
            t("Form submitted"),
            t(
              "You have successfully submitted a reset password request.",
            ),
          );
          setTimeout(() => {
            navigate("/reset-password");
          }, 500);
        } else {
          error(t("Something went wrong"), res.data.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [t, setLoading, form, navigate]);

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
                    {t("Send my password reset code")}
                  </Title>
                  <Space h={30} />
                  <form onSubmit={form.onSubmit(submit)}>
                    <TextInput
                      key={form.key("email")}
                      {...form.getInputProps("email")}
                      withAsterisk={true}
                      label={t("Email")}
                      placeholder={t("Email")}
                    />
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
