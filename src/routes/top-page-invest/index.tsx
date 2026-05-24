// cspell: disable
/* eslint-disable jsx-a11y/anchor-is-valid */
import ipad1 from "@/assets/images/ipad/ipad1.svg";
import ipad2 from "@/assets/images/ipad/ipad2.svg";
import AppButton from "@/ui/Button/AppButton";

import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Group,
  Highlight,
  Image,
  Modal,
  SimpleGrid,
  Space,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import {
  IconCheck,
  IconChevronsRight,
  IconCopy,
  IconMail,
  IconMoonStars,
} from "@tabler/icons-react";

import useSPETranslation from "@/hooks/useSPETranslation";
import classes from "./index.module.scss";

import { useNavigate } from "react-router-dom";

const SUPPORT_EMAIL = "support@cryptocopyinvest.com";

export default function TopPage() {
  return (
    <>
      <ServiceStoppedNotice />
      <Banner />
      <Box
        className={classes.bgtopage}
        style={{ overflow: "hidden" }}
      >
        <Space my={"md"} />
        <Container>
          <CardsIntro />
        </Container>
        <Space h={50} />
      </Box>
    </>
  );
}

function ServiceStoppedNotice() {
  const t = useSPETranslation();
  const clipboard = useClipboard({ timeout: 1500 });
  return (
    <Modal
      opened
      onClose={() => {
        // Locked: this notice cannot be dismissed.
      }}
      centered
      size="50vw"
      radius={20}
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
      trapFocus
      lockScroll
      overlayProps={{
        className: classes.noticeOverlay,
      }}
      classNames={{
        body: classes.noticeBody,
      }}
      styles={{
        content: {
          background:
            "linear-gradient(180deg, #0a0a0a 0%, #050505 100%)",
          border: "1px solid rgba(255, 202, 99, 0.18)",
          boxShadow:
            "0 30px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,202,99,0.05)",
        },
        header: { display: "none" },
      }}
    >
      <Box className={classes.noticeAura} />
      <Stack gap={22} className={classes.noticeContent}>
        <Box className={classes.noticeEmblem}>
          <IconMoonStars size={36} stroke={1.4} />
        </Box>

        <Stack gap={10}>
          <Text className={classes.noticeKicker}>
            {t("A note from the team")}
          </Text>
          <Title className={classes.noticeHeadline} order={2}>
            {t("Our journey ends here")}
          </Title>
          <Box className={classes.noticeDivider} />
        </Stack>

        <Text className={classes.noticeBodyText}>
          {t(
            "%s has officially ceased operations. Thank you for trading, learning, and growing with us.",
            localStorage.__APP_NAME__,
          )}
        </Text>

        <Box className={classes.noticeEmailCard}>
          <Group justify="space-between" wrap="nowrap" gap="md">
            <Stack gap={4} style={{ minWidth: 0 }}>
              <Text className={classes.noticeEmailLabel}>
                {t("For inquiries, write to")}
              </Text>
              <Text className={classes.noticeEmail}>
                {SUPPORT_EMAIL}
              </Text>
            </Stack>
            <UnstyledButton
              onClick={() => clipboard.copy(SUPPORT_EMAIL)}
              aria-label={t("Copy email address")}
              style={{
                flexShrink: 0,
                width: 40,
                height: 40,
                borderRadius: 10,
                display: "grid",
                placeItems: "center",
                color: clipboard.copied
                  ? "#7ee787"
                  : "rgba(255, 202, 99, 0.9)",
                background: clipboard.copied
                  ? "rgba(126, 231, 135, 0.1)"
                  : "rgba(255, 202, 99, 0.08)",
                border: `1px solid ${clipboard.copied ? "rgba(126,231,135,0.3)" : "rgba(255,202,99,0.25)"}`,
                transition: "all 180ms ease",
              }}
            >
              {clipboard.copied ? (
                <IconCheck size={18} stroke={2} />
              ) : (
                <IconCopy size={18} stroke={1.6} />
              )}
            </UnstyledButton>
          </Group>
        </Box>

        <Button
          component="a"
          href={`mailto:${SUPPORT_EMAIL}`}
          variant="gradient"
          gradient={{ from: "primary", to: "yellow", deg: 90 }}
          size="md"
          radius="xl"
          fullWidth
          leftSection={<IconMail size={18} stroke={1.8} />}
        >
          {t("Contact support")}
        </Button>

        <Text className={classes.noticeFootnote}>
          {t("— With gratitude, the team")}
        </Text>
      </Stack>
    </Modal>
  );
}

export function Banner() {
  const t = useSPETranslation();
  const navigate = useNavigate();
  return (
    <>
      <Box className="banner" py={40}>
        <Container>
          <Flex
            gap={"xl"}
            align={"start"}
            className="banner--box"
            justify={"space-between"}
          >
            <Box
              w={{
                sm: "50%",
              }}
            >
              <Box>
                <Text fz={"55px"} pb={10} c={"white"} fw={"bolder"}>
                  {t("Invest Like The Best.")}
                </Text>
              </Box>
              <Title pb={10} className={classes.textPrimary}>
                {t(
                  "Trade crypto and win big, just like a pro.Simple. Smart. Secure.",
                )}
              </Title>
              <Space my={"md"} />
              <Grid w={"fit-content"} gutter={5} columns={12}>
                <Grid.Col span={6}>
                  <AppButton
                    size="lg"
                    radius={"xl"}
                    onClick={() =>
                      navigate("/trade/futures/BTC/USDT")
                    }
                  >
                    {t("Trade Now")}
                  </AppButton>
                </Grid.Col>
                <Grid.Col span={6}>
                  <AppButton
                    size="lg"
                    radius={"xl"}
                    variant="outline"
                    onClick={() => navigate("/copy-trading")}
                  >
                    {t("Copy Traders")}
                  </AppButton>
                </Grid.Col>
              </Grid>
            </Box>

            <Box
              className="card_ipad"
              pos={"relative"}
              h={"100%"}
              w={{
                sm: "50%",
              }}
            >
              <Box
                h={"100%"}
                left={0}
                top={0}
                pos={{
                  md: "absolute",
                }}
                w={"100%"}
              >
                <Box
                  className="rotate-container ipad1"
                  maw={{
                    sm: 400,
                  }}
                  w={"100%"}
                  h={"100%"}
                  onWaiting={() => {
                    // TODO
                  }}
                  mx={"auto"}
                >
                  <Image
                    className="rotate-image"
                    mx={"auto"}
                    maw={"100%"}
                    src={ipad1}
                    loading="lazy"
                  />
                </Box>
                <Box
                  className="rotate-container ipad2"
                  maw={{
                    sm: 400,
                  }}
                  w={"100%"}
                  onWaiting={() => {
                    // TODO
                  }}
                  mx={"auto"}
                >
                  <Image
                    className="rotate-image-opz"
                    mx={"auto"}
                    maw={"100%"}
                    src={ipad2}
                  />
                </Box>
              </Box>
            </Box>
          </Flex>
        </Container>
      </Box>
    </>
  );
}

function CardsIntro() {
  const t = useSPETranslation();
  const navigate = useNavigate();
  return (
    <>
      <Space my={"xl"} />
      <Title order={1} ta={"center"}>
        {t("Discover More Opportunities")}
      </Title>

      <Space my={"xl"} />
      <SimpleGrid
        cols={{
          md: 3,
          sm: 2,
          xs: 1,
        }}
        styles={{
          root: {
            gap: "40px",
          },
        }}
      >
        <Card radius="md">
          <Flex direction={"column"} h={"100%"}>
            <Highlight
              ta="left"
              highlight={["40% commission"]}
              highlightStyles={{
                backgroundImage:
                  "linear-gradient(45deg, var(--mantine-color-primary-5), var(--mantine-color-yellow-5))",
                fontWeight: 700,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              component={Title}
              order={4}
            >
              {t(
                "Invite friends and earn up to 40% commission for every trade they make in %s",
                localStorage.__APP_NAME__,
              )}
            </Highlight>
            <Space my={"md"} />
            <Box mt={"auto"}>
              <Button
                variant="gradient"
                gradient={{ from: "primary", to: "yellow", deg: 90 }}
                onClick={() => {
                  window.open("/referral-program", "_blank");
                }}
              >
                {t("Start Inviting")}
                <IconChevronsRight size={18} />
              </Button>
            </Box>
          </Flex>
        </Card>
        <Card radius="md">
          <Flex direction={"column"} h={"100%"}>
            <Highlight
              ta="left"
              highlight={["10% profit sharing"]}
              highlightStyles={{
                backgroundImage:
                  "linear-gradient(45deg, var(--mantine-color-primary-5), var(--mantine-color-yellow-5))",
                fontWeight: 700,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              component={Title}
              order={4}
            >
              {t(
                "Earn up to 10% profit sharing effortlessly with the Promoter referral link",
              )}
            </Highlight>
            <Space my={"md"} />
            <Box mt={"auto"}>
              <Button
                onClick={() => {
                  window.open("/referer", "_blank");
                }}
                variant="gradient"
                gradient={{ from: "primary", to: "yellow", deg: 90 }}
              >
                {t("Find Out More")}
                <IconChevronsRight size={18} />
              </Button>
            </Box>
          </Flex>
        </Card>
        <Card radius="md">
          <Flex direction={"column"} h={"100%"}>
            <Highlight
              ta="left"
              highlight={["COPY TRADING"]}
              highlightStyles={{
                backgroundImage:
                  "linear-gradient(45deg, var(--mantine-color-primary-5), var(--mantine-color-yellow-5))",
                fontWeight: 700,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              component={Title}
              order={4}
            >
              {t(
                "Seamlessly follow expert strategies! Maximize your profit with our COPY TRADING feature",
              )}
            </Highlight>
            <Space my={"md"} />
            <Box>
              <Button
                mt={"auto"}
                onClick={() => navigate("/copy-trading")}
                variant="gradient"
                gradient={{ from: "primary", to: "yellow", deg: 90 }}
              >
                {t("Copy Now")}
                <IconChevronsRight size={18} />
              </Button>
            </Box>
          </Flex>
        </Card>
      </SimpleGrid>
    </>
  );
}
