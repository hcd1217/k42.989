import { ASSET_COIN_LIST } from "@/common/configs";
import { COIN_IMAGES } from "@/domain/config";
import useSPETranslation from "@/hooks/useSPETranslation";
import { assetStore } from "@/store/assets";
import NumberFormat from "@/ui/NumberFormat";
import { NoDataRecord } from "@/ui/SPEMisc";
import AppText from "@/ui/Text/AppText";
import {
  Box,
  Button,
  Card,
  Center,
  Container,
  CopyButton,
  Flex,
  Group,
  Image,
  lighten,
  Paper,
  SimpleGrid,
  Space,
  Table,
  TableData,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  IconCalendar,
  IconCheck,
  IconCopy,
} from "@tabler/icons-react";
import { QRCodeSVG } from "qrcode.react";
import { useMemo, useState } from "react";
import classes from "./styles.module.css";

export default function Invite() {
  return (
    <>
      <Banner />
      <Container>
        <Flex py={20} gap={20} direction={"column"}>
          <InviteInfo />
          <RebatesHistory />
          <InvitationDetails />
          <RebatesDetails />
        </Flex>
      </Container>
    </>
  );
}

function Banner() {
  const t = useSPETranslation();
  const [code, refererLink] = useMemo(() => {
    const code = authStore.getState().me?.affiliateCode || "";
    return [code, `${window.location.origin}/register/${code}`];
  }, []);

  return (
    <Box className="banner-copy">
      <Center w={"100%"}>
        <Container w={"100%"}>
          <Flex
            justify={"space-between"}
            gap={20}
            wrap={{
              xs: "wrap",
              md: "nowrap",
            }}
          >
            <Box>
              <Center h={"100%"}>
                <Box>
                  <Text className="textWithCopy">
                    {t("Referral Link")}
                  </Text>
                  <AppText
                    fz={24}
                    c={lighten("black", 1)}
                    instancetype="BannerTextSub"
                  >
                    {t(
                      "Earn up to 40% commission on each of their trades",
                    )}
                  </AppText>
                  <Space mb={20} />
                  <Flex gap={20}></Flex>
                </Box>
              </Center>
            </Box>

            <Card
              pos={"relative"}
              w={{
                xs: "100%",
                sm: "fit-content",
              }}
              mih={"176px"}
              radius={12}
              p={0}
              bd={"1px solid rgba(178,203,221, .3)"}
            >
              <Box
                style={{
                  padding: "20px 18px",
                }}
                pos={"relative"}
              >
                <Flex align={"center"} gap={10} mb={10}>
                  <AppText fz={"16px"} fw={"bold"}>
                    {`${t("Scan QR code and join me at")} ${
                      localStorage.__APP_NAME__ || ""
                    } !`}
                  </AppText>
                </Flex>
                <Box>
                  <SimpleGrid cols={1}>
                    <Flex justify={"center"}>
                      <QRCodeSVG value={refererLink} />
                    </Flex>
                    <Flex
                      gap={10}
                      direction={"column"}
                      justify={"space-between"}
                    >
                      <TextInput
                        readOnly
                        label={t("Invitation Code")}
                        rightSectionWidth={"fit-content"}
                        value={code}
                        rightSection={
                          <Flex
                            w={"100%"}
                            gap={10}
                            justify={"end"}
                            align={"center"}
                            px={"xs"}
                          >
                            <CopyButton value={code}>
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
                                    <IconCheck size={18} />
                                  ) : (
                                    <IconCopy size={18} />
                                  )}
                                </Button>
                              )}
                            </CopyButton>
                          </Flex>
                        }
                      />
                      <TextInput
                        readOnly
                        label={t("Referral Link")}
                        rightSectionWidth={"fit-content"}
                        value={refererLink}
                        rightSection={
                          <Flex
                            w={"100%"}
                            gap={10}
                            justify={"end"}
                            align={"center"}
                            px={"xs"}
                          >
                            <CopyButton value={refererLink}>
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
                                    <IconCheck size={18} />
                                  ) : (
                                    <IconCopy size={18} />
                                  )}
                                </Button>
                              )}
                            </CopyButton>
                          </Flex>
                        }
                      />
                    </Flex>
                  </SimpleGrid>
                </Box>
              </Box>
            </Card>
          </Flex>
        </Container>
      </Center>
    </Box>
  );
}

const data = [
  {
    title: "Total Friends Invited",
    icon: "receipt",
    value: 0,
  },
  {
    title: "Direct Invitees",
    icon: "coin",
    value: 0,
  },
  {
    title: "Indirect Invitees",
    icon: "discount",
    value: 0,
  },
  {
    title: "Direct Referral Rate",
    icon: "user",
    value: 0,
  },
  {
    title: "Indirect Referral Rate",
    icon: "user",
    value: 0,
  },
];
export function InviteInfo() {
  const t = useSPETranslation();

  const stats = data.map((stat) => {
    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group justify="space-between">
          <Text size="xs" c="dimmed" className={classes.title}>
            {t(stat.title)}
          </Text>
        </Group>

        <Group align="flex-end" gap="xs" mt={25}>
          <Text className={classes.value}>{stat.value}</Text>
        </Group>
      </Paper>
    );
  });
  return (
    <Card>
      <Title order={2}>{t("Overview")}</Title>
      <Space my={"md"} />
      <SimpleGrid cols={{ xs: 0, sm: 3, md: 4, lg: 5 }}>
        {stats}
      </SimpleGrid>
    </Card>
  );
}

export function RebatesHistory() {
  const t = useSPETranslation();
  const { balances } = assetStore();
  const tableData: TableData = useMemo(() => {
    const rows = balances.filter(() => {
      return true;
    });
    return {
      head: ["Coin", "Date", "Rebate Amount"].map((el) => t(el)),
      body:
        [] ??
        rows.map((row) => [
          <>
            <Flex align={"center"} gap={10}>
              <Box>
                <Image w={30} h={30} src={COIN_IMAGES[row.coin]} />
              </Box>
              <Box>
                <Title order={6}>{row.coin}</Title>
                <Text c="dimmed">{ASSET_COIN_LIST[row.coin]}</Text>
              </Box>
            </Flex>
          </>,
          <>
            <Text hiddenFrom="sm" c={"dimmed"}>
              {t("Date")}
            </Text>
            <Title order={6}>
              <Text size={"sm"} fw={"bold"}>
                {new Date().toLocaleString()}
              </Text>
            </Title>
          </>,
          <>
            <Text hiddenFrom="sm" c={"dimmed"}>
              {t("Rebate Amount")}
            </Text>
            <Title order={6}>
              {
                <NumberFormat
                  decimalPlaces={8}
                  value={row.locked || 0}
                />
              }
            </Title>
            <Text c="dimmed" size="xs">
              ~ $
              {
                <NumberFormat
                  decimalPlaces={3}
                  value={row.lockedUsdValue || 0}
                />
              }
            </Text>
          </>,
        ]),
    };
  }, [balances, t]);

  return (
    <Card>
      <Flex
        justify={"space-between"}
        align={{
          xs: "stretch",
          sm: "center",
        }}
        direction={{
          xs: "column",
          sm: "row",
        }}
        w={"100%"}
      >
        <Title order={2}>{t("Rebates History")}</Title>
        <Box py={10}>
          <DateRangePicker />
        </Box>
      </Flex>
      <Space my={"md"} />
      <Box
        h={{
          xs: "unset",
          md: 400,
        }}
      >
        <Box h={"100%"}>
          <Table.ScrollContainer minWidth={"100%"} h={"100%"}>
            <Table
              data={tableData}
              stickyHeader
              highlightOnHover
              classNames={{
                table: "table-sticky-column table-list-gird-view",
              }}
              styles={{
                th: {
                  whiteSpace: "nowrap",
                  fontSize: "12px",
                },
              }}
            />
            {tableData.body?.length === 0 && <NoDataRecord />}
          </Table.ScrollContainer>
        </Box>
      </Box>
    </Card>
  );
}

export function InvitationDetails() {
  const t = useSPETranslation();
  const { balances } = assetStore();
  const tableData: TableData = useMemo(() => {
    const rows = balances.filter(() => {
      return true;
    });
    return {
      head: ["Coin", "Date", "Rebate Amount"].map((el) => t(el)),
      body:
        [] ??
        rows.map((row) => [
          <>
            <Flex align={"center"} gap={10}>
              <Box>
                <Image w={30} h={30} src={COIN_IMAGES[row.coin]} />
              </Box>
              <Box>
                <Title order={6}>{row.coin}</Title>
                <Text c="dimmed">{ASSET_COIN_LIST[row.coin]}</Text>
              </Box>
            </Flex>
          </>,
          <>
            <Text hiddenFrom="sm" c={"dimmed"}>
              {t("Date")}
            </Text>
            <Title order={6}>
              <Text size={"sm"} fw={"bold"}>
                {new Date().toLocaleString()}
              </Text>
            </Title>
          </>,
          <>
            <Text hiddenFrom="sm" c={"dimmed"}>
              {t("Rebate Amount")}
            </Text>
            <Title order={6}>
              {
                <NumberFormat
                  decimalPlaces={8}
                  value={row.locked || 0}
                />
              }
            </Title>
            <Text c="dimmed" size="xs">
              ~ $
              {
                <NumberFormat
                  decimalPlaces={3}
                  value={row.lockedUsdValue || 0}
                />
              }
            </Text>
          </>,
        ]),
    };
  }, [balances, t]);
  return (
    <Card>
      <Flex
        justify={"space-between"}
        align={{
          xs: "stretch",
          sm: "center",
        }}
        direction={{
          xs: "column",
          sm: "row",
        }}
        w={"100%"}
      >
        <Title order={2}>{t("Invitation Details")}</Title>
        <Box py={10}>
          <DateRangePicker />
        </Box>
      </Flex>
      <Space my={"md"} />
      <Box
        h={{
          xs: "unset",
          md: 400,
        }}
      >
        <Box h={"100%"}>
          <Table.ScrollContainer minWidth={"100%"} h={"100%"}>
            <Table
              data={tableData}
              stickyHeader
              highlightOnHover
              classNames={{
                table: "table-sticky-column table-list-gird-view",
              }}
              styles={{
                th: {
                  whiteSpace: "nowrap",
                  fontSize: "12px",
                },
              }}
            />
            {tableData.body?.length === 0 && <NoDataRecord />}
          </Table.ScrollContainer>
        </Box>
      </Box>
    </Card>
  );
}

export function RebatesDetails() {
  const t = useSPETranslation();
  const { balances } = assetStore();
  const tableData: TableData = useMemo(() => {
    const rows = balances.filter(() => {
      return true;
    });
    return {
      head: ["Coin", "Date", "Rebate Amount"].map((el) => t(el)),
      body:
        [] ??
        rows.map((row) => [
          <>
            <Flex align={"center"} gap={10}>
              <Box>
                <Image w={30} h={30} src={COIN_IMAGES[row.coin]} />
              </Box>
              <Box>
                <Title order={6}>{row.coin}</Title>
                <Text c="dimmed">{ASSET_COIN_LIST[row.coin]}</Text>
              </Box>
            </Flex>
          </>,
          <>
            <Text hiddenFrom="sm" c={"dimmed"}>
              {t("Date")}
            </Text>
            <Title order={6}>
              <Text size={"sm"} fw={"bold"}>
                {new Date().toLocaleString()}
              </Text>
            </Title>
          </>,
          <>
            <Text hiddenFrom="sm" c={"dimmed"}>
              {t("Rebate Amount")}
            </Text>
            <Title order={6}>
              {
                <NumberFormat
                  decimalPlaces={8}
                  value={row.locked || 0}
                />
              }
            </Title>
            <Text c="dimmed" size="xs">
              ~ $
              {
                <NumberFormat
                  decimalPlaces={3}
                  value={row.lockedUsdValue || 0}
                />
              }
            </Text>
          </>,
        ]),
    };
  }, [balances, t]);
  return (
    <Card>
      <Flex
        justify={"space-between"}
        align={{
          xs: "stretch",
          sm: "center",
        }}
        direction={{
          xs: "column",
          sm: "row",
        }}
        w={"100%"}
      >
        <Title order={2}>{t("Rebates Details")}</Title>
        <Box py={10}>
          <DateRangePicker />
        </Box>
      </Flex>
      <Space my={"md"} />
      <Box
        h={{
          xs: "unset",
          md: 400,
        }}
      >
        <Box h={"100%"}>
          <Table.ScrollContainer minWidth={"100%"} h={"100%"}>
            <Table
              data={tableData}
              stickyHeader
              highlightOnHover
              classNames={{
                table: "table-sticky-column table-list-gird-view",
              }}
              styles={{
                th: {
                  whiteSpace: "nowrap",
                  fontSize: "12px",
                },
              }}
            />
            {tableData.body?.length === 0 && <NoDataRecord />}
          </Table.ScrollContainer>
        </Box>
      </Box>
    </Card>
  );
}

import authStore from "@/store/auth";
import "dayjs/locale/ja";

function DateRangePicker() {
  const t = useSPETranslation();
  const [value, setValue] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  return (
    <Flex
      align={"center"}
      gap={10}
      w={{
        xs: "100%",
        md: 320,
      }}
    >
      {/* <Title size={16}>{t("Period")}</Title> */}
      <DatePickerInput
        rightSection={
          <>
            <IconCalendar />
          </>
        }
        placeholder={t("Start Date - End Date")}
        w={"100%"}
        size="md"
        locale="ja"
        type="range"
        value={value}
        onChange={setValue}
      />
    </Flex>
  );
}
