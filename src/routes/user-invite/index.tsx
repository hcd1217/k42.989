import { ASSET_COIN_LIST } from "@/common/configs";
import { beginOfMonth } from "@/common/utils";
import { COIN_IMAGES } from "@/domain/config";
import useSPETranslation from "@/hooks/useSPETranslation";
import { affiliateStore } from "@/store/affiliate";
import authStore from "@/store/auth";
import { RebateDetail, Referral } from "@/types";
import { DateRangePicker } from "@/ui/DateRangePicker";
import NumberFormat from "@/ui/NumberFormat";
import { NoDataRecord } from "@/ui/SPEMisc";
import AppText from "@/ui/Text/AppText";
import { formatCurrency } from "@/utils";
import {
  Box,
  Button,
  Card,
  Center,
  Container,
  CopyButton,
  Flex,
  Image,
  lighten,
  SimpleGrid,
  Space,
  Table,
  TableData,
  Text,
  TextInput,
  Title,
  Image,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCheck, IconCopy, IconEye } from "@tabler/icons-react";
import { QRCodeSVG } from "qrcode.react";
import { useCallback, useEffect, useMemo, useState } from "react";
import classes from "./styles.module.scss";

export default function Invite() {
  return (
    <>
      <Banner />
      <Container>
        <Flex py={20} gap={20} direction={"column"}>
          <Overview />
          <RebatesHistory />
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
                        rightSectionWidth={60}
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

function Overview() {
  const { rebate, fetch } = affiliateStore();
  const t = useSPETranslation();

  const data = useMemo(
    () => [
      {
        title: t("Total user"),
        stats: rebate.overview.user,
        description: t(
          "The total number of users who have registered through your referral link.",
        ),
      },
      {
        title: t("Total Earned"),
        stats: formatCurrency(rebate.overview.rebate || 0),
        description: t(
          "The cumulative earnings you’ve received from your referrals' trading activities.",
        ),
      },
      {
        title: t("Earnings to Fees Ratio"),
        stats: formatCurrency(Math.abs(rebate.overview.ratio || 0)),
        description: t(
          "The ratio of the commission you have earned to the total trading fees generated by referred users.",
        ),
      },
    ],
    [
      rebate.overview.ratio,
      rebate.overview.rebate,
      rebate.overview.user,
      t,
    ],
  );

  const stats = data.map((stat) => (
    <div key={stat.title} className={classes.stat}>
      <Text className={classes.count}>{stat.stats}</Text>
      <Text className={classes.title}>{stat.title}</Text>
      <Text className={classes.description}>{stat.description}</Text>
    </div>
  ));

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <Box>
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
        className={classes.root}
      >
        {stats}
      </Flex>
    </Box>
  );
}

export function RebatesHistory() {
  const t = useSPETranslation();
  const { rebate, fetch } = affiliateStore();

  const onClick = useCallback(async (referral: Referral) => {
    modals.open({
      withCloseButton: false,
      centered: true,
      padding: "lg",
      size: "xl",
      children: (
        <RebatesDetails
          contact={referral.contact}
          code={referral.userDepositCode}
        />
      ),
    });
  }, []);

  const tableData: TableData = useMemo(() => {
    return {
      head: [
        "User Name",
        "Total Rebate Amount",
        "Total Trading Fee",
        "Referral From",
      ].map((el) => t(el)),
      body: rebate.referrals.map((referral) => [
        <>
          <Text hiddenFrom="sm" c={"dimmed"}>
            {t("User Name")}
          </Text>
          <Title order={6}>
            <Text size={"sm"} fw={"bold"}>
              {referral.contact}
            </Text>
          </Title>
        </>,
        <>
          <Text hiddenFrom="sm" c={"dimmed"}>
            {t("Rebate")}
          </Text>
          <Title order={6}>
            {
              <NumberFormat
                decimalPlaces={8}
                value={Math.abs(referral.totalRebate || 0)}
              />
            }
          </Title>
          <Text c="dimmed" size="xs">
            ~ $
            {
              <NumberFormat
                decimalPlaces={3}
                value={Math.abs(referral.totalRebate || 0)}
              />
            }
          </Text>
        </>,
        <>
          <Text hiddenFrom="sm" c={"dimmed"}>
            {t("Fee")}
          </Text>
          <Title order={6}>
            {
              <NumberFormat
                decimalPlaces={8}
                value={Math.abs(referral.totalTradingFee || 0)}
              />
            }
          </Title>
          <Text c="dimmed" size="xs">
            ~ $
            {
              <NumberFormat
                decimalPlaces={3}
                value={Math.abs(referral.totalTradingFee || 0)}
              />
            }
          </Text>
        </>,
        <>
          <Text hiddenFrom="sm" c={"dimmed"}>
            {t("Date")}
          </Text>
          <Title order={6}>
            <Text size={"sm"} fw={"bold"}>
              {new Date(referral.referredAt).toLocaleString()}
            </Text>
          </Title>
        </>,
        <>
          <Text
            hiddenFrom="sm"
            c={"dimmed"}
            onClick={() => onClick(referral)}
            style={{ cursor: "pointer" }}
          >
            {t("View Detail")}
          </Text>
          <Title order={6} visibleFrom="sm">
            <Button
              variant="outline"
              bd={"none"}
              onClick={() => onClick(referral)}
            >
              <IconEye />
            </Button>
          </Title>
        </>,
      ]),
    };
  }, [onClick, rebate.referrals, t]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <>
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
      </Flex>
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
    </>
  );
}

export function RebatesDetails({
  contact,
  code,
}: {
  contact: string;
  code: string;
}) {
  const t = useSPETranslation();

  const { fetchDetail } = affiliateStore();
  const [data, setData] = useState<RebateDetail[]>([]);

  const [time, setTime] = useState<[Date | null, Date | null]>([
    new Date(beginOfMonth()) || null,
    new Date() || null,
  ]);

  const _reload = useCallback(async () => {
    const from = time[0]?.getTime() || Date.now();
    const to = time[1]?.getTime() || Date.now();

    setData(await fetchDetail(code, from, to));
  }, [code, fetchDetail, time]);

  useEffect(() => {
    _reload();
  }, [_reload]);

  const tableData: TableData = useMemo(() => {
    return {
      head: ["Coin", "Date", "Rebate Amount", "Fee"].map((el) =>
        t(el),
      ),
      body: data.map((row) => [
        // TODO: hard code
        <>
          <Flex align={"center"} gap={10}>
            <Box>
              <Image w={30} h={30} src={COIN_IMAGES["USDT"]} />
            </Box>
            <Box>
              <Title order={6}>{row.coin}</Title>
              <Text c="dimmed">{ASSET_COIN_LIST["USDT"]}</Text>
            </Box>
          </Flex>
        </>,

        <>
          <Text hiddenFrom="sm" c={"dimmed"}>
            {t("Date")}
          </Text>
          <Title order={6}>
            <Text size={"sm"} fw={"bold"}>
              {new Date(row.updatedAt).toLocaleString()}
            </Text>
          </Title>
        </>,

        <>
          <Text hiddenFrom="sm" c={"dimmed"}>
            {t("Rebate")}
          </Text>
          <Title order={6}>
            {"$"}
            {formatCurrency(Math.abs(row.amount || 0)) || "-"}
          </Title>
        </>,

        <>
          <Text hiddenFrom="sm" c={"dimmed"}>
            {t("Fee")}
          </Text>
          <Title order={6}>
            {formatCurrency(Math.abs(row.fee || 0)) || "-"}
          </Title>
        </>,
      ]),
    };
  }, [data, t]);

  return (
    <>
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
        <Title order={2}>{contact}</Title>
        <Box py={10}>
          <DateRangePicker
            w="15rem"
            value={time}
            setValue={setTime}
          />
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
    </>
  );
}
