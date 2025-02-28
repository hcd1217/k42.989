import useTranslation from "@/hooks/useSPETranslation";
import authStore from "@/store/auth";
import {
  AntiPhishingCodeSettingsForm,
  EditNickNameForm,
} from "@/ui/Profile";
import { BindEmailForm } from "@/ui/Profile/Forms/BindEmailForm";
import {
  Avatar,
  Box,
  Button,
  Container,
  CopyButton,
  Divider,
  Flex,
  Grid,
  Space,
  Text,
} from "@mantine/core";
import {
  IconBrandGoogle,
  IconCheck,
  IconCircleCheckFilled,
  IconCopy,
  IconId,
  IconInfoCircleFilled,
  IconLock,
  IconMail,
  IconShieldCheckFilled,
} from "@tabler/icons-react";
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { LoginHistories } from "./LoginHistory";

const kycColors: Record<string, string> = {
  0: "red",
  1: "red",
  2: "green",
  3: "green",
};
const kycLevels: Record<string, string> = {
  0: "Unverified",
  1: "Unverified",
  2: "Basic",
  3: "Advanced",
};

export default function Profile() {
  const t = useTranslation();
  const { me, kycLevel, isPendingKyc } = authStore();
  const kycLabel = useMemo(() => {
    if (isPendingKyc) {
      return t("Pending");
    }
    return kycLevel !== "3" ? t("Verify now") : t("Configured");
  }, [isPendingKyc, kycLevel, t]);
  const navigate = useNavigate();
  return (
    <Container>
      <Box py={"xl"}>
        <Flex>
          <Text fz={24} fw={600}>
            {t("Account Information")}
          </Text>
        </Flex>
        <Space my={"xl"} />
        <Divider />
        <Space my={"xl"} />
        <EditNickNameForm />
        <Space my={"xl"} />
        <Box>
          <Flex gap={40}>
            <Box>
              <Text fz={14} c={"dimmed"}>
                {t("UID")}
              </Text>
              <Flex align={"center"} gap={10}>
                <Text fz={20} fw={"bold"}>
                  {me?.depositCode || ""}
                </Text>
                <Flex align={"start"}>
                  <CopyButton value="194260796">
                    {({ copied, copy }) => (
                      <Button
                        h={"auto"}
                        mih={0}
                        p={0}
                        variant="transparent"
                        color={copied ? "teal" : "primary"}
                        onClick={copy}
                      >
                        {copied ? (
                          <IconCheck size={16} />
                        ) : (
                          <IconCopy size={16} />
                        )}
                      </Button>
                    )}
                  </CopyButton>
                </Flex>
              </Flex>
            </Box>
            <Box>
              <Text fz={14} c={"dimmed"}>
                {t("Security Level")}
              </Text>
              <Flex align={"center"} gap={10}>
                <KycLevel kycLevel={kycLevel} />
              </Flex>
            </Box>
            <Box hidden>
              <Text fz={14} c={"dimmed"}>
                {t("KYC (ID Verification)")}
              </Text>
              <Flex align={"center"} gap={10}>
                <KycLevel kycLevel={kycLevel} />
              </Flex>
            </Box>
          </Flex>
        </Box>
        <Space my={"xl"} />
        <Divider />
        <Space my={"xl"} />
        <Box>
          <Grid columns={24}>
            <Grid.Col
              span={{
                xs: 24,
                md: 10,
              }}
            >
              <Flex gap={12} align={"center"}>
                <Avatar size={44}>
                  <IconLock />
                </Avatar>
                <Box>
                  <Text fz={16} fw={600}>
                    {t("Login Password")}
                  </Text>
                  <Text fz={14} fw={400} c={"dimmed"}>
                    {t("Use this password for account login.")}
                  </Text>
                </Box>
              </Flex>
            </Grid.Col>
            <Grid.Col
              span={{
                xs: 24,
                md: 8,
              }}
            >
              <Flex align={"center"} gap={5} justify={"end"}>
                <IconCircleCheckFilled color="green" />
                <Text fz={14}>{t("Configured")}</Text>
              </Flex>
            </Grid.Col>
            <Grid.Col
              span={{
                xs: 24,
                md: 6,
              }}
            >
              <Flex
                justify={{
                  xs: "",
                  md: "end",
                }}
                align={"center"}
                h={"100%"}
              >
                <Button
                  component={Link}
                  to="/user/modify-password"
                  variant="gradient"
                  miw={150}
                  fullWidth
                  px={"xs"}
                  gradient={{
                    from: "orange",
                    to: "yellow",
                    deg: 90,
                  }}
                >
                  {t("Change password")}
                </Button>
              </Flex>
            </Grid.Col>
            <Grid.Col span={24}>
              <Divider />
            </Grid.Col>

            <Grid.Col
              span={{
                xs: 24,
                md: 10,
              }}
            >
              {/* KYC  */}
              <Flex gap={12} align={"center"}>
                <Avatar size={44}>
                  <IconId />
                </Avatar>
                <Box>
                  <Text fz={16} fw={600}>
                    {t("KYC (ID Verification)")}
                  </Text>
                  <Text fz={14} fw={400} c={"dimmed"}>
                    {t(
                      "Advanced KYC is required for withdrawal and applying for Master in copy trading.",
                    )}
                  </Text>
                </Box>
              </Flex>
            </Grid.Col>
            <Grid.Col
              span={{
                xs: 24,
                md: 8,
              }}
            >
              <Flex
                align={"center"}
                gap={5}
                justify={"end"}
                h={"100%"}
              >
                <KycLevel kycLevel={kycLevel} />
              </Flex>
            </Grid.Col>
            <Grid.Col
              span={{
                xs: 24,
                md: 6,
              }}
            >
              <Flex
                justify={{
                  xs: "",
                  md: "end",
                }}
                align={"center"}
                h={"100%"}
              >
                <Button
                  disabled={kycLevel === "3"}
                  fullWidth
                  component="a"
                  onClick={() => {
                    if (kycLevel === "3") {
                      return;
                    }
                    navigate("/user/kyc");
                  }}
                  variant="gradient"
                  miw={150}
                  px={"xs"}
                  gradient={{
                    from: "orange",
                    to: "yellow",
                    deg: 90,
                  }}
                >
                  {kycLabel}
                </Button>
              </Flex>
            </Grid.Col>
            <Grid.Col span={24}>
              <Divider />
            </Grid.Col>

            <Grid.Col
              span={{
                xs: 24,
                md: 10,
              }}
            >
              {/* Email */}
              <Flex gap={12} align={"center"}>
                <Avatar size={44}>
                  <IconMail />
                </Avatar>
                <Box>
                  <Text fz={16} fw={600}>
                    {t("Email Verification")}
                  </Text>
                  <Text fz={14} fw={400} c={"dimmed"}>
                    {t(
                      "Use this email for login and security verification.",
                    )}
                  </Text>
                </Box>
              </Flex>
            </Grid.Col>
            <Grid.Col
              span={{
                xs: 24,
                md: 8,
              }}
            >
              <Flex
                align={"center"}
                gap={5}
                justify={"end"}
                h={"100%"}
              >
                <IconInfoCircleFilled
                  color={me?.emailVerified ? "green" : "gray"}
                />
                <Text fz={14}>
                  {t(me?.emailVerified ? "Verified" : "Not Verified")}
                </Text>
              </Flex>
            </Grid.Col>
            <Grid.Col
              span={{
                xs: 24,
                md: 6,
              }}
            >
              <Flex
                justify={{
                  xs: "",
                  md: "end",
                }}
                align={"center"}
                h={"100%"}
              >
                <BindEmailForm />
              </Flex>
            </Grid.Col>
            <Grid.Col span={24}>
              <Divider />
            </Grid.Col>

            <Grid.Col
              span={{
                xs: 24,
                md: 10,
              }}
            >
              <Flex gap={12} align={"center"}>
                <Avatar size={44}>
                  <IconBrandGoogle />
                </Avatar>
                <Box>
                  <Text fz={16} fw={600}>
                    {t("Google Authentication")}
                  </Text>
                  <Text fz={14} fw={400} c={"dimmed"}>
                    {t(
                      "Secure your account by enabling 2FA through Google Authenticator.",
                    )}
                  </Text>
                </Box>
              </Flex>
            </Grid.Col>
            <Grid.Col
              span={{
                xs: 24,
                md: 8,
              }}
            >
              <Flex
                align={"center"}
                gap={5}
                justify={"end"}
                h={"100%"}
              >
                <IconCircleCheckFilled
                  color={me?.hasMfa ? "green" : "gray"}
                />
                <Text fz={14}>
                  {me?.hasMfa ? t("Bind") : t("Not Bind")}
                </Text>
              </Flex>
            </Grid.Col>
            <Grid.Col
              span={{
                xs: 24,
                md: 6,
              }}
            >
              <Flex
                justify={{
                  xs: "",
                  md: "end",
                }}
                align={"center"}
                h={"100%"}
              >
                <Button
                  component={Link}
                  to={
                    me?.hasMfa ? "/user/rebind-ga" : "/user/bind-ga"
                  }
                  fullWidth
                  variant="gradient"
                  miw={150}
                  px={"xs"}
                  gradient={{
                    from: "orange",
                    to: "yellow",
                    deg: 90,
                  }}
                >
                  {t(me?.hasMfa ? "ReBind GA" : "Bind GA")}
                </Button>
              </Flex>
            </Grid.Col>
            <Grid.Col span={24}>
              <Divider />
            </Grid.Col>

            <Grid.Col
              span={{
                xs: 24,
                md: 10,
              }}
            >
              <Flex gap={12} align={"center"}>
                <Avatar size={44}>
                  <IconShieldCheckFilled />
                </Avatar>
                <Box>
                  <Text fz={16} fw={600}>
                    {t("Anti-Phishing Code")}
                  </Text>
                  <Text fz={14} fw={400} c={"dimmed"}>
                    {t(
                      "Protect your account from phishing attempts by ensuring that emails are only from %s",
                      localStorage.__APP_NAME__,
                    )}
                  </Text>
                </Box>
              </Flex>
            </Grid.Col>
            <Grid.Col
              span={{
                xs: 24,
                md: 8,
              }}
            >
              <Flex
                align={"center"}
                gap={5}
                justify={"end"}
                h={"100%"}
              >
                <IconCircleCheckFilled
                  color={me?.hasAntiPhishingCode ? "green" : "gray"}
                />
                <Text fz={14}>
                  {t(
                    me?.hasAntiPhishingCode
                      ? "Configured"
                      : "Not Configured",
                  )}
                </Text>
              </Flex>
            </Grid.Col>
            <Grid.Col
              span={{
                xs: 24,
                md: 6,
              }}
            >
              <Flex
                justify={{
                  xs: "",
                  md: "end",
                }}
                align={"center"}
                h={"100%"}
              >
                <AntiPhishingCodeSettingsForm />
              </Flex>
            </Grid.Col>
            <Grid.Col span={24}>
              <Divider />
            </Grid.Col>
          </Grid>
        </Box>
        {/* <Space my={"xl"} />
        <Title order={3}>{t("Login History")}</Title>
        <Space my={"xl"} />
        <Divider /> */}
        {/* <LoginHistories /> */}
      </Box>
    </Container>
  );
}

function KycLevel({ kycLevel }: { kycLevel?: string }) {
  const t = useTranslation();
  return (
    <Text fz={20} fw={600} c={kycColors[kycLevel || "0"]}>
      {t(kycLevels[kycLevel || 0])}
    </Text>
  );
}
