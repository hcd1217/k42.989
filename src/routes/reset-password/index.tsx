import { schema } from "@/domain/schema";
import useSPETranslation from "@/hooks/useSPETranslation";
import AppForm from "@/ui/Form/Form";
import { Header } from "@/ui/Header";
import {
  Box,
  Card,
  Center,
  Container,
  Flex,
  Group,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { convertToResetPasswordFormData } from "./config";
import classes from "./index.module.scss";

const Page = () => {
  const t = useSPETranslation();
  const navigate = useNavigate();
  const formData = useMemo(() => {
    const searchParams = Object.fromEntries(
      window.location.search
        ?.replace("?", "")
        .split("&")
        .map((el) => el.split("=")),
    );
    const code = searchParams["code"] || "";
    const email = searchParams["email"] || "";
    const mobile = searchParams["mobile"] || "";
    if (!email && !mobile) {
      return {};
    }
    return Object.assign({}, schema.ResetPassword.formData, {
      type: email ? "1" : "2",
      mobile: { mobile, type: "2", code },
      email: { email, type: "1", code },
    });
  }, []);
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
                  <AppForm
                    schema={schema.ResetPassword.schema}
                    uiSchema={schema.ResetPassword.uiSchema}
                    formData={formData}
                    w={"100%"}
                    msgSuccess={t("Password reset has been done")}
                    onSuccess={() => {
                      setTimeout(() => {
                        navigate("/login");
                      }, 1000);
                    }}
                    api="/api/password/reset"
                    formDataConverter={convertToResetPasswordFormData}
                    messages={{
                      titleSuccess: t("Password Reset Successful"),
                      msgSuccess: t(
                        "Your password has been successfully reset. You can now log in with your new password. If you did not request this change, please contact our support team immediately.",
                      ),
                    }}
                  />
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
