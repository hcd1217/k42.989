import { schema } from "@/domain/schema";
import useSPETranslation from "@/hooks/useSPETranslation";
import AppForm from "@/ui/Form/Form";
import { svgLogo } from "@/ui/Logo/Logo";
import { SwitchDarkLightMode } from "@/ui/SwitchDarkLight";
import SwitchLanguage from "@/ui/SwitchLanguage/SwitchLanguage";
import {
  Box,
  Card,
  Center,
  Flex,
  Group,
  Image,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { convertToSignUpFormData } from "./config";
import classes from "./index.module.scss";

const SignUp = () => {
  const t = useSPETranslation();

  return (
    <>
      <Flex
        direction={"column"}
        className={classes.bgGray}
        h={"100vh"}
      >
        <Box className="sticky-top" px={20} bg={"black"}>
          <Group justify="space-between">
            <a href="/top-page">
              <Image src={svgLogo} w={140} />
            </a>
            <Group>
              <SwitchLanguage onDarkMode />
              <SwitchDarkLightMode onDarkMode />
            </Group>
          </Group>
        </Box>
        <Box flex={1} visibleFrom="lg">
          <Center h={"100%"} w={"100%"}>
            <Card
              radius={"lg"}
              p={"xl"}
              maw={500}
              w={"100%"}
              shadow="lg"
            >
              <Box w={"100%"}>
                <Title order={3}>
                  {t(
                    "You're invited to %s!",
                    localStorage.__APP_NAME__,
                  )}
                </Title>
                <Space h={30} />
                <AppForm
                  schema={schema.SignUp.schema}
                  uiSchema={schema.SignUp.uiSchema}
                  formData={schema.SignUp.formData}
                  w={"100%"}
                  api="/api/register"
                  formDataConverter={convertToSignUpFormData}
                  messages={{
                    titleError: t("Account Registration Failed"),
                    titleSuccess: t(
                      "Account Registration Successful",
                    ),
                    msgSuccess: t(
                      "Congratulations! Your account has been successfully created. Welcome to our community. Please check your email for a verification link to complete your registration.",
                    ),
                  }}
                  onSuccess={() => {
                    window.open("/login", "_self");
                  }}
                />
                <Group justify="center" mt={"lg"}>
                  <div>
                    {t("You already registered?")}{" "}
                    <Text component="a" href="/login" fw={"bold"}>
                      {t("Log In")}
                    </Text>
                  </div>
                </Group>
              </Box>
            </Card>
          </Center>
        </Box>
        <Flex
          align="center"
          justify="center"
          h="90vh"
          hiddenFrom="lg"
        >
          <Box w={"100%"}>
            <Card radius={"lg"} p={"xl"}>
              <Title order={3}>
                {t(
                  "You're invited to %s!",
                  localStorage.__APP_NAME__,
                )}
              </Title>
              <Space h={30} />
              <AppForm
                schema={schema.SignUp.schema}
                uiSchema={schema.SignUp.uiSchema}
                formData={schema.SignUp.formData}
                w={"100%"}
                api="/api/register"
                formDataConverter={convertToSignUpFormData}
                messages={{
                  titleError: t("Account Registration Failed"),
                  titleSuccess: t("Account Registration Successful"),
                  msgSuccess: t(
                    "Congratulations! Your account has been successfully created. Welcome to our community. Please check your email for a verification link to complete your registration.",
                  ),
                }}
                onSuccess={() => {
                  window.open("/login", "_self");
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
        </Flex>
      </Flex>
    </>
  );
};

export default SignUp;
