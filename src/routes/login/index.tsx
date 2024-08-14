import useSPETranslation from "@/hooks/useSPETranslation";
import logger from "@/services/logger";
import { Header } from "@/ui/Header";
import {
  Box,
  Card,
  Center,
  Flex,
  Group,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { useCallback } from "react";
import { ForceChangePasswordForm } from "./ForceChangePasswordForm";
import LoginForm from "./form";
import classes from "./login.module.scss";

const Login = () => {
  const t = useSPETranslation();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const onLoginSuccess = useCallback(
    (res: {
      token: string;
      userId?: string;
      forceChangePassword?: boolean;
    }) => {
      if (res.forceChangePassword) {
        res.token = "";
        logger.debug("Force Change Password", res);
        modals.open({
          title: t("Reset Password"),
          centered: true,
          closeOnClickOutside: false,
          padding: "lg",
          size: "lg",
          children: (
            <ForceChangePasswordForm userId={res.userId || ""} />
          ),
        });
      } else {
        _authenticated(res);
      }
    },
    [t],
  );

  return (
    <>
      <Flex
        direction={"column"}
        h={"100vh"}
        className={classes.bgGray}
        w={"100%"}
      >
        <Header />
        <Box className={classes.bgGray} flex={1} w={"100%"}>
          <Center h={"100%"} w={"100%"}>
            <Box w={"100%"}>
              <Card
                radius={"lg"}
                p={"xl"}
                maw={500}
                w={"100%"}
                mx={"auto"}
              >
                <Title
                  fz={isMobile ? "lg" : undefined}
                  order={3}
                  style={{ textAlign: "center" }}
                >
                  {t(
                    "You're enjoy to %s!",
                    localStorage.__APP_NAME__,
                  )}
                </Title>
                <Space h={30} />
                <Box w={isMobile ? "80vw" : undefined}>
                  <LoginForm onSuccess={onLoginSuccess} />
                </Box>
              </Card>
              <Group justify="center" my={"lg"}>
                <div>
                  <Text component="a" href="/forgot-password">
                    {t("Forgot Password?")}
                  </Text>
                </div>
                <div>
                  {t("Not a member?")}{" "}
                  <Text component="a" href="/register" fw={"bold"}>
                    {t("Sign Up")}
                  </Text>
                </div>
              </Group>
            </Box>
          </Center>
        </Box>
      </Flex>
    </>
  );
};

export default Login;

function _authenticated(res: { token: string }) {
  const query = new URLSearchParams(window.location.search);
  const redirectPath = query.get("redirect") || "/";
  const token = res?.token || "";
  if (token) {
    localStorage.__TOKEN__ = token;
    window.location.href = redirectPath;
  }
}
