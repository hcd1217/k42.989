/* eslint-disable react/prop-types */
import BN from "@/common/big-number";
import { priceDisplay } from "@/common/utils";
import { MODAL_STYLES } from "@/domain/config";
import useSPETranslation from "@/hooks/useSPETranslation";
import { fetchMasterTraders, fetchTrader } from "@/services/apis";
import logger from "@/services/logger";
import authStore from "@/store/auth";
import {
  MasterTraderInformation,
  PublicCopyMasterDetail,
} from "@/types";
import AppButton from "@/ui/Button/AppButton";
import AppCard from "@/ui/Card/AppCard";
import AppChart from "@/ui/Chart/Chart";
import { CopySettingForm } from "@/ui/Copy";
import NumberFormat from "@/ui/NumberFormat";
import { OptionFilter } from "@/ui/OptionFilter";
import { AppPopover } from "@/ui/Popover/AppPopover";
import SPEMasterOrderHistory from "@/ui/SPEMasterOrderHistory";
import AppText from "@/ui/Text/AppText";
import { ONE_DAY, ONE_HOUR, ONE_MINUTE } from "@/utils";
import { avatarUrl, fmtDate } from "@/utils/utility";
import {
  Avatar,
  Box,
  Center,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Progress,
  SimpleGrid,
  Space,
  Tabs,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconChartInfographic,
  IconChartPie,
  IconCoinBitcoin,
  IconShare,
  IconStar,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./index.module.scss";

// enum TradeDataType {
//   CURRENT_POSITION = "CURRENT_POSITION",
//   ORDER_HISTORY = "ORDER_HISTORY",
// }

type Period = "All" | "7D" | "30D" | "90D";

const periodOptions = ["7D", "30D", "90D", "All"].map((el) => ({
  label: el,
  value: el,
}));

export default function CopyTradeDetail() {
  const params = useParams();
  const [trader, setTrader] = useState<PublicCopyMasterDetail>();

  useEffect(() => {
    fetchTrader(params?.id).then((trader) => {
      trader && setTrader(trader);
    });
  }, [params.id]);

  if (!trader) {
    return <></>;
  }
  return (
    <>
      <Banner {...trader} key={trader?.masterAccountId || ""} />
      <Box className="bg-copy-trade">
        <Container>
          <Grid gutter={21} py={21}>
            <Grid.Col
              span={{
                xs: 12,
                sm: 4,
              }}
            >
              <Performance {...trader} />
            </Grid.Col>
            <Grid.Col
              span={{
                xs: 12,
                sm: 8,
              }}
            >
              <AppCard>
                <TabsUI {...trader} />
              </AppCard>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

function Banner(trader: PublicCopyMasterDetail) {
  const t = useSPETranslation();
  const navigate = useNavigate();
  const [myTrader, setMyTrader] = useState<MasterTraderInformation>();
  const { me } = authStore();

  useEffect(() => {
    fetchMasterTraders().then((traders) => {
      setMyTrader(() => {
        return traders.find((t) => {
          if (t.masterAccountId === trader.masterAccountId) {
            return BN.gt(t.ratio || 0, 0);
          }
          return false;
        });
      });
    });
  }, [trader]);

  return (
    <>
      <Box
        className="banner-copy-detail"
        py={{
          xs: "30px",
          md: "0",
        }}
        h={{
          xs: "auto",
          md: "315px",
        }}
      >
        <Container h={"100%"}>
          <Center w={"100%"} h={"100%"}>
            <Flex
              w={"100%"}
              justify={"space-between"}
              wrap={{
                xs: "wrap",
                md: "nowrap",
              }}
            >
              <Box>
                <Flex
                  gap={36}
                  wrap={{
                    xs: "wrap",
                    md: "nowrap",
                  }}
                >
                  <Box
                    w={{
                      xs: "100%",
                      md: "unset",
                    }}
                  >
                    <Avatar
                      mx={{
                        xs: "auto",
                        md: "unset",
                      }}
                      size={126}
                      src={avatarUrl(trader.avatar)}
                    />
                  </Box>
                  <Box>
                    <AppText fz={32} c={"white"} fw={"bold"}>
                      {trader.name}
                    </AppText>
                    <Space mb={10} />
                    <Box>
                      <Flex gap={24} align={"center"}>
                        <Box>
                          <AppPopover
                            width={200}
                            target={(props) => ({
                              children: (
                                <AppText
                                  className="cursor-pointer"
                                  instancetype="WithSize14Gray"
                                  onMouseEnter={props.open}
                                  onMouseLeave={props.close}
                                  component="span"
                                >
                                  {t("Follower(s)")}
                                </AppText>
                              ),
                            })}
                            dropdown={() => ({
                              children: (
                                <AppText
                                  fz={12}
                                  style={{ textAlign: "center" }}
                                >
                                  {t(" No. of Current Follower(s)")}
                                </AppText>
                              ),
                            })}
                          ></AppPopover>
                          <AppText c={"white"} fw={"bolder"} fz={24}>
                            {trader.followers || 0}
                          </AppText>
                        </Box>
                        <Box>
                          <Divider
                            h={32}
                            orientation="vertical"
                            color={"#404347"}
                          />
                        </Box>
                        <Box>
                          <AppPopover
                            width={200}
                            target={(props) => ({
                              children: (
                                <AppText
                                  className="cursor-pointer"
                                  instancetype="WithSize14Gray"
                                  component="span"
                                  onMouseEnter={props.open}
                                  onMouseLeave={props.close}
                                >
                                  {t("Trading Days")}
                                </AppText>
                              ),
                            })}
                            dropdown={() => ({
                              children: (
                                <AppText
                                  fz={12}
                                  style={{ textAlign: "center" }}
                                >
                                  {t(
                                    "The days when a Master Trader holds open positions.",
                                  )}
                                </AppText>
                              ),
                            })}
                          ></AppPopover>
                          <AppText c={"white"} fw={"bolder"} fz={24}>
                            {_tradingDays(trader.startAt)}
                          </AppText>
                        </Box>
                      </Flex>
                    </Box>
                    <Space mb={30} />
                    <Box>
                      <Flex
                        gap={16}
                        align={"center"}
                        wrap={{
                          xs: "wrap",
                          md: "nowrap",
                        }}
                      >
                        <Box>
                          <AppPopover
                            width={200}
                            target={(props) => ({
                              children: (
                                <Group gap={5} align="center">
                                  <IconCoinBitcoin
                                    color="white"
                                    width={20}
                                  />
                                  <AppText
                                    c={"white"}
                                    fz={14}
                                    className="cursor-pointer"
                                    onMouseEnter={props.open}
                                    onMouseLeave={props.close}
                                  >
                                    {`${t(
                                      "AUM",
                                    )}: ${trader.aum.toLocaleString()} USDT`}
                                  </AppText>
                                </Group>
                              ),
                            })}
                            dropdown={() => ({
                              children: (
                                <AppText
                                  fz={12}
                                  style={{ textAlign: "center" }}
                                >
                                  {t(
                                    "All assets owned in the Copy Trading Account",
                                  )}
                                </AppText>
                              ),
                            })}
                          />
                        </Box>
                        <Box>
                          <Divider
                            h={12}
                            orientation="vertical"
                            color={"#404347"}
                          />
                        </Box>
                        <Box>
                          <Group align="center" gap={10}>
                            <AppPopover
                              width={200}
                              target={(props) => ({
                                children: (
                                  <Group gap={5} align="center">
                                    <IconChartInfographic
                                      color="white"
                                      width={20}
                                    />
                                    <AppText
                                      c={"white"}
                                      fz={14}
                                      className="cursor-pointer"
                                      onMouseEnter={props.open}
                                      onMouseLeave={props.close}
                                    >
                                      {`${t(
                                        "Total Assets",
                                      )}: ${trader.assets.toLocaleString()} USDT`}
                                    </AppText>
                                  </Group>
                                ),
                              })}
                              dropdown={() => ({
                                children: (
                                  <AppText
                                    fz={12}
                                    style={{ textAlign: "center" }}
                                  >
                                    {t(
                                      "All assets a Master Trader owns in the Copy Trading Account.",
                                    )}
                                  </AppText>
                                ),
                              })}
                            />
                          </Group>
                        </Box>
                        <Box>
                          <Divider
                            h={12}
                            orientation="vertical"
                            color={"#404347"}
                          />
                        </Box>
                        <Box
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          <Flex align={"center"} gap={10}>
                            <IconChartPie color="white" width={20} />
                            <AppText c={"white"} fz={14}>
                              {t("Profit Sharing")} {trader.sharing}%
                            </AppText>
                          </Flex>
                        </Box>
                      </Flex>
                    </Box>
                  </Box>
                </Flex>
              </Box>
              <Box
                w={{
                  xs: "100%",
                  md: "unset",
                }}
                py={{
                  xs: "30px",
                  md: "0",
                }}
                pl={{
                  xs: "0",
                  md: "calc(126px + 30px)",
                  lg: "0",
                }}
              >
                <Flex gap={20} align={"center"}>
                  <Group gap={10} className="cursor-pointer">
                    <IconShare color="white" width={20} />
                    <AppText fz={12} c={"white"} fw={"bold"}>
                      {t("Share")}
                    </AppText>
                  </Group>
                  <Box>
                    <Divider
                      h={14}
                      orientation="vertical"
                      color={"#404347"}
                    />
                  </Box>
                  <Group gap={10} className="cursor-pointer">
                    <IconStar color="white" width={20} />
                    <AppText fz={12} c={"white"} fw={"bold"}>
                      {t("Subscribe")}
                    </AppText>
                  </Group>
                </Flex>
                <Space mb={24} />
                {BN.gt(myTrader?.ratio || 0, 0) ? (
                  <AppButton
                    instancetype="WithGradient"
                    onClick={() => {
                      navigate("/copy/mine/traders");
                    }}
                  >
                    {t("Copy history")}
                  </AppButton>
                ) : (
                  <AppButton
                    instancetype="WithGradient"
                    onClick={() => {
                      if (!me?.id) {
                        const { pathname, search } = window.location;
                        navigate(
                          `/login?redirect=${encodeURIComponent(
                            pathname + search,
                          )}`,
                        );
                        return;
                      }
                      modals.open({
                        ...MODAL_STYLES,
                        title: t("Follow %s", trader.name),
                        children: (
                          <CopySettingForm
                            masterAccountId={trader.masterAccountId}
                          />
                        ),
                      });
                    }}
                  >
                    {t("Copy")}
                  </AppButton>
                )}
                <Space mb={10} />
                <AppText
                  style={{ textAlign: "center" }}
                  c={"white"}
                  fz={12}
                >
                  <AppText
                    fw={900}
                    variant="gradient"
                    component="span"
                    gradient={{
                      from: "orange",
                      to: "yellow",
                      deg: 90,
                    }}
                  >
                    {trader.maxFollowers - trader.followers}
                  </AppText>{" "}
                  {t("Slots Left")}
                </AppText>
              </Box>
            </Flex>
          </Center>
        </Container>
      </Box>
    </>
  );
}

function Performance({
  performance,
  followerPnL,
}: PublicCopyMasterDetail) {
  const t = useSPETranslation();
  const [time, setTime] = useState<Period>("All");

  const data = useMemo(() => {
    logger.debug("performance", time);
    if (time === "All") {
      return performance.all;
    } else if (time === "7D") {
      return performance.w;
    } else if (time === "30D") {
      return performance.m;
    } else {
      return performance.q;
    }
  }, [performance, time]);

  const performanceItems = useMemo(() => {
    const total = Number(data?.avgHoldTime || 0) * ONE_MINUTE;
    const days = Math.floor(total / ONE_DAY);
    const hours = Math.floor((total % ONE_DAY) / ONE_HOUR);

    return [
      [
        t("Profit-to-Loss Ratio"),
        <>
          {Number(data?.totalWin)}
          {" :  "}
          {Number(data?.totalLose)}
        </>,
        t(
          "The ratio of average profit per winning order to average loss per losing order.",
        ),
      ],
      [
        t("Weekly Trades"),
        <>
          <NumberFormat value={data?.weeklyTrade} decimalPlaces={2} />
        </>,
        t(
          "The average number of trades the Master Trader made weekly in the last month.",
        ),
      ],
      [
        t("Avg. Holding Time"),
        <>
          <span>
            {days > 0
              ? `${days} ${t(days > 1 ? "Days" : "Day")} `
              : ""}
            {hours > 0
              ? `${hours} ${t(hours > 1 ? "Hours" : "Hour")} `
              : ""}
          </span>
        </>,
        t(
          "The average position holding period of all closed positions",
        ),
      ],
      [
        t("Last Traded at"),
        <>
          {data?.lastTrade
            ? fmtDate(Number(data.lastTrade || 0))
            : "--"}
        </>,
        t(
          "The last time the Master Trader opened or closed a position.",
        ),
      ],
    ] as [string, JSX.Element, string][]; // cspell:disable
  }, [data, t]);

  return (
    <>
      <Flex direction={"column"} gap={21}>
        <AppCard>
          <Box>
            <Group justify="space-between" p={0} m={0}>
              <AppText fz={16} fw={"bold"}>
                {t("Performance")}
              </AppText>
              <OptionFilter
                onChange={(v) => setTime(v as Period)}
                value={time}
                items={periodOptions}
              />
            </Group>
            <Space mb={10} />
            <Divider h={1} color="#f3f5f7" />
            <Space mb={10} />
            <SimpleGrid cols={2}>
              <div>
                <AppPopover
                  width={200}
                  target={(props) => ({
                    children: (
                      <AppText
                        component="span"
                        instancetype="WidthTooltipGray"
                        className="cursor-pointer"
                        onMouseEnter={props.open}
                        onMouseLeave={props.close}
                      >
                        ROI
                      </AppText>
                    ),
                  })}
                  dropdown={() => ({
                    children: (
                      <AppText instancetype="WithTextTooltip">
                        {t(
                          "ROI is a performance measure used to evaluate the efficiency or profitability of a Master Trader.",
                        )}
                      </AppText>
                    ),
                  })}
                ></AppPopover>
                <AppText
                  instancetype="withPriceLong"
                  c={priceDisplay(data?.roi).color}
                >
                  <NumberFormat
                    prefix={priceDisplay(data?.roi).sub}
                    value={data?.roi}
                    suffix="%"
                  />
                </AppText>
              </div>
              <Flex align={"end"} direction={"column"}>
                <AppPopover
                  width={200}
                  target={(props) => ({
                    children: (
                      <AppText
                        component="span"
                        instancetype="WidthTooltipGray"
                        className="cursor-pointer"
                        onMouseEnter={props.open}
                        onMouseLeave={props.close}
                      >
                        {t("Master's PnL")}
                      </AppText>
                    ),
                  })}
                  dropdown={() => ({
                    children: (
                      <AppText instancetype="WithTextTooltip">
                        {t(
                          "Total profit that includes realized and unrealized PnL",
                        )}
                      </AppText>
                    ),
                  })}
                ></AppPopover>
                <AppText
                  instancetype="withPriceLong"
                  c={priceDisplay(data?.pnl).color}
                >
                  <NumberFormat
                    prefix={priceDisplay(data?.pnl).sub}
                    value={data?.pnl}
                  />
                </AppText>
              </Flex>
              <div>
                <AppPopover
                  width={200}
                  target={(props) => ({
                    children: (
                      <AppText
                        component="span"
                        instancetype="WidthTooltipGray"
                        className="cursor-pointer"
                        onMouseEnter={props.open}
                        onMouseLeave={props.close}
                      >
                        {t("Win Rate")}
                      </AppText>
                    ),
                  })}
                  dropdown={() => ({
                    children: (
                      <AppText instancetype="WithTextTooltip">
                        {t(
                          "Shows the average win rate of a Master Trader over a certain period.",
                        )}
                      </AppText>
                    ),
                  })}
                ></AppPopover>
                <AppText instancetype="withPriceLong">
                  <NumberFormat value={data?.winRate} suffix="%" />
                </AppText>
              </div>
              <Flex align={"end"} direction={"column"}>
                <AppPopover
                  width={200}
                  target={(props) => ({
                    children: (
                      <AppText
                        component="span"
                        instancetype="WidthTooltipGray"
                        className="cursor-pointer"
                        onMouseEnter={props.open}
                        onMouseLeave={props.close}
                      >
                        {"Followers' PnL"}
                      </AppText>
                    ),
                  })}
                  dropdown={() => ({
                    children: (
                      <AppText instancetype="WithTextTooltip">
                        {
                          "Total profit of past and current Followers. Master's and Followers' PnL may be inconsistent as Followers' entry time/prices may vary."
                        }
                      </AppText>
                    ),
                  })}
                ></AppPopover>
                <AppText
                  instancetype="withPriceLong"
                  c={priceDisplay(followerPnL).color}
                >
                  <NumberFormat
                    prefix={priceDisplay(followerPnL).sub}
                    value={followerPnL}
                    decimalPlaces={0}
                  />
                </AppText>
              </Flex>
              <div>
                <AppPopover
                  width={200}
                  target={(props) => ({
                    children: (
                      <AppText
                        component="span"
                        instancetype="WidthTooltipGray"
                        className="cursor-pointer"
                        onMouseEnter={props.open}
                        onMouseLeave={props.close}
                      >
                        {t("Max. Drawdown")}
                      </AppText>
                    ),
                  })}
                  dropdown={() => ({
                    children: (
                      <AppText instancetype="WithTextTooltip">
                        {
                          "A low Max. Drawdown indicates that the unrealized losses from a Master Trader's trading strategy has been relatively small."
                        }
                      </AppText>
                    ),
                  })}
                ></AppPopover>
                <AppText instancetype="withPriceLong">
                  <NumberFormat
                    value={-Number(data?.maxDrawDown || 0)}
                  />
                </AppText>
              </div>
              <Flex align={"end"} direction={"column"}>
                <AppPopover
                  width={200}
                  target={(props) => ({
                    children: (
                      <AppText
                        component="span"
                        instancetype="WidthTooltipGray"
                        className="cursor-pointer"
                        onMouseEnter={props.open}
                        onMouseLeave={props.close}
                      >
                        {t("Avg. PnL per Trade")}
                      </AppText>
                    ),
                  })}
                  dropdown={() => ({
                    children: (
                      <AppText instancetype="WithTextTooltip">
                        {t(
                          "The average profit and loss of all the closed positions made by a Master Trader. A higher chartType indicates that the Master Trader has a good performance in terms of profit.",
                        )}
                      </AppText>
                    ),
                  })}
                ></AppPopover>
                <AppText
                  instancetype="withPriceLong"
                  c={priceDisplay(data?.avgPnlPerTrade).color}
                >
                  <NumberFormat
                    prefix={priceDisplay(data?.avgPnlPerTrade).sub}
                    value={data?.avgPnlPerTrade}
                  />
                </AppText>
              </Flex>
            </SimpleGrid>
            <Space mb={10} />
            <Divider h={1} color="#f3f5f7" />
            <Space mb={15} />
            <Box>
              <Flex justify={"space-between"} mb={5}>
                <AppText instancetype="withPriceNormal">
                  {t("Win")}{" "}
                  <AppText
                    component="span"
                    c={"green"}
                    instancetype="withPriceNormal"
                    fw={"bold"}
                  >
                    <NumberFormat value={data?.totalWin} />
                  </AppText>
                </AppText>
                <AppText instancetype="withPriceNormal">
                  {t("Lose")}{" "}
                  <AppText
                    instancetype="withPriceNormal"
                    component="span"
                    c={"gray"}
                  >
                    <NumberFormat value={data?.totalLose} />
                  </AppText>
                </AppText>
              </Flex>
              <Box>
                <Progress
                  value={Number(data?.winRate || 0)}
                  color="green"
                />
              </Box>
            </Box>
            <Space mb={20} />
            <SimpleGrid cols={2}>
              {performanceItems.map(([v1, v2, v3], i) => (
                <Fragment key={i}>
                  <>
                    <AppPopover
                      width={200}
                      target={(props) => ({
                        children: (
                          <AppText
                            component="span"
                            instancetype="WidthTooltipGray"
                            className="cursor-pointer"
                            onMouseEnter={props.open}
                            onMouseLeave={props.close}
                          >
                            {v1}
                          </AppText>
                        ),
                      })}
                      dropdown={() => ({
                        children: (
                          <AppText instancetype="WithTextTooltip">
                            {v3}
                          </AppText>
                        ),
                      })}
                    ></AppPopover>
                    <Flex align={"end"} direction={"column"}>
                      <AppText instancetype="withPriceNormal">
                        {v2}
                      </AppText>
                    </Flex>
                  </>
                </Fragment>
              ))}
              <div></div>
              <Flex align={"end"} direction={"column"}>
                <AppText
                  component="span"
                  instancetype="WidthTooltipGray"
                  fz={12}
                >
                  {t("Measured in: USDT")}
                </AppText>
              </Flex>
            </SimpleGrid>
          </Box>
        </AppCard>
      </Flex>
    </>
  );
}

type ChartType = "pnl" | "a" | "r";

const labels: Record<ChartType, string> = {
  pnl: "Pnl",
  a: "Assets",
  r: "ROI",
};
const units: Record<ChartType, string> = {
  pnl: "%",
  a: " USDT",
  r: "%",
};

function TabsUI(props: PublicCopyMasterDetail) {
  const t = useSPETranslation();
  const [chartType] = useState<ChartType>("a");
  const [value, setValue] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [limit, setLimit] = useState<Period>("90D");

  const { chartKey, minY, maxY, data } = useMemo(() => {
    const last = props.assets;
    const raw = props.performance.charts || [];
    const diff = last - raw[raw.length - 1][1];

    const d: number =
      {
        "7D": 7,
        "30D": 30,
        "90D": 90,
        "All": 365,
      }[limit] ?? 90;
    const [from, to] = value;
    const start = from?.getTime() || Date.now() - d * ONE_DAY;
    const end = to?.getTime() || Date.now();
    const assetMap: Map<number, number> = new Map();
    // TODO: fix type
    raw.forEach(([ts, a]) => {
      if (start <= ts && ts <= end) {
        assetMap.set(ts - (ts % ONE_DAY), a + diff);
      }
    });

    const x = raw.map((el) => el[1]);
    const data = [...assetMap.entries()].sort((a, b) => a[0] - b[0]);
    let minY = diff + Math.min(...x);
    const k = 1e3;
    minY = Math.floor((0.98 * minY) / k) * k;
    let maxY = diff + Math.max(...x);
    maxY = Math.ceil((1.02 * maxY) / k) * k;
    const chartKey = `${chartType}.${start}.${end}`;
    return { chartKey, minY, maxY, data };
  }, [
    props.assets,
    props.performance.charts,
    limit,
    value,
    chartType,
  ]);

  return (
    <>
      <Tabs
        defaultValue="statistics"
        className="tabsCopyTradeDetail"
        keepMounted
        classNames={{
          tab: "tab-item-1",
          list: "tab-item-2",
          panel: "tab-item-3",
          root: "tab-item-4",
          tabLabel: "tab-item-5",
          tabSection: "tab-item-6",
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="statistics">{t("Statistics")}</Tabs.Tab>
          <Tabs.Tab value="tradingData">{t("Trading Data")}</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="statistics">
          <Space my={"md"} />
          <Box h={320} w={"100%"} my={20} pos={"relative"}>
            <Flex justify="end">
              <OptionFilter
                onChange={(v) => {
                  setLimit(v as Period);
                  setValue([null, null]);
                }}
                value={limit}
                items={periodOptions}
              />
            </Flex>
            <AppChart
              key={chartKey}
              instancetype="SingLine"
              chartSeries={[
                {
                  name: labels[chartType] || "",
                  data: data.map((el) => Math.round(el[1])),
                },
              ]}
              chartOptions={{
                xaxis: {
                  categories: data.map((el) =>
                    format(new Date(el[0]), "dd/MM"),
                  ),
                },
                yaxis: {
                  min: minY,
                  max: maxY,
                },
                title: {
                  text: "",
                },
                tooltip: {
                  y: {
                    formatter: (val) =>
                      `${val.toLocaleString()}${
                        units[chartType] || ""
                      }`,
                  },
                },
              }}
            />
          </Box>
        </Tabs.Panel>
        <Tabs.Panel value="tradingData">
          <Space my={"md"} />
          <Box>
            <SPEMasterOrderHistory
              masterAccountId={props.masterAccountId}
              noMargin
              noFollower
            />
          </Box>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}

function _tradingDays(startAt: number) {
  if (startAt < 100) {
    return "---";
  }
  return Math.round(
    (Date.now() - startAt) / ONE_DAY,
  ).toLocaleString();
}
