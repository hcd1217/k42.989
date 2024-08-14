// cspell: disable
/* eslint-disable jsx-a11y/anchor-is-valid */
import useSPETranslation from "@/hooks/useSPETranslation";
import AppButton from "@/ui/Button/AppButton";
import CarouselPage from "@/ui/Carousel/Carousel";
import AppChart, { randomizeArraySparkline } from "@/ui/Chart/Chart";
import MarqueeList from "@/ui/Marquee/Marquee";
import AppPill from "@/ui/Pill/AppPill";
import AppTable, { generateItems } from "@/ui/Table/AppTable";
import AppText from "@/ui/Text/AppText";
import {
  Avatar,
  Box,
  Card,
  Center,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  Input,
  NumberFormatter,
  Space,
  Tabs,
  Text,
  Timeline,
  Title,
  alpha,
} from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./index.module.scss";

type Gainer = {
  id: string;
  token: string;
  quote: string;
  base: string;
  lastPrice: number;
  change: number;
  icon: string;
};

export default function TopPage() {
  const [mainTokens, setMainTokens] = useState(generateItems(6));
  const [gainersTokens] = useState(generateItems(3));
  const [newListingsTokens] = useState(generateItems(3));
  return (
    <>
      <Banner />
      <SliderNotice />
      <Box
        className={classes.bgtopage}
        style={{ overflow: "hidden" }}
      >
        <Space h={50} />
        <Container>
          <Box>
            <CarouselPage />
          </Box>
          <Space h={30} />
          <Box>
            <Group justify="space-between">
              <Title order={2}>
                Catch Your Next Trading Opportunity
              </Title>
              <AppButton
                instancetype="WithRightIcon"
                size="lg"
                color="primary"
                variant="light"
              >
                See more
              </AppButton>
            </Group>
            <Space h={"md"} />
            <Grid gutter={"lg"}>
              <Grid.Col
                span={{
                  md: 8,
                }}
              >
                <Card radius={"lg"} h={"100%"}>
                  <Tabs
                    defaultValue="first"
                    bd={1}
                    onChange={() => {
                      setMainTokens(generateItems(6));
                    }}
                  >
                    <Tabs.List bd={1}>
                      <Tabs.Tab value="first">
                        <AppText instancetype="TabTitle">
                          Favorites
                        </AppText>
                      </Tabs.Tab>
                      <Tabs.Tab value="second">
                        <AppText instancetype="TabTitle">
                          Hot Derivatives
                        </AppText>
                      </Tabs.Tab>
                      <Tabs.Tab value="third">
                        <AppText instancetype="TabTitle">
                          Hot Coins
                        </AppText>
                      </Tabs.Tab>
                    </Tabs.List>
                  </Tabs>
                  <Space h={5} />
                  <TableBar items={mainTokens} />
                </Card>
              </Grid.Col>
              <Grid.Col
                span={{
                  md: 4,
                }}
              >
                <Card radius={"lg"} h={"100%"}>
                  <Box>
                    <Title order={4}>Top Gainers</Title>
                    <Space h={18} />
                    <Divider size={1} />
                    <Space h={10} />
                    <TableBarTopGainers items={gainersTokens} />
                  </Box>
                  <Space h={20} />
                  <Box>
                    <Title order={4}>New Listings</Title>
                    <Space h={18} />
                    <Divider size={1} />
                    <Space h={10} />
                    <TableBarNewListing items={newListingsTokens} />
                  </Box>
                </Card>
              </Grid.Col>
              <Grid.Col
                span={{
                  md: 8,
                }}
              >
                <AppButton instancetype="WithRightIcon" size="lg">
                  Deposit or Buy Crypto
                </AppButton>
              </Grid.Col>
            </Grid>
            <Space h={50} />
            <TrendingTraders />
          </Box>
          {/* <Box>
                        <Icon iconProps={{ style: { width: rem(16), height: rem(16) } }} icon={IconBabyCarriageFilled} color={theme.colors.dark[7]} />
                    </Box> */}
        </Container>
        <Space h={50} />
        <Container>
          <QuickStart />
        </Container>
        <Space h={50} />
        <Container>
          <PartnerSection />
        </Container>
        <Space h={50} />
      </Box>
    </>
  );
}

function Banner() {
  const t = useSPETranslation();
  return (
    <>
      <Box className="banner" py={40}>
        <Container>
          <Flex gap={"xl"} align={"center"} className="banner--box">
            <Box>
              <Title pb={10} className={classes.textLight}>
                {t("Invest Like The Best.")}
              </Title>
              <Title pb={10} className={classes.textPrimary}>
                {t("Vie for triumph and win up to 25,000 USDT!")}
              </Title>
              <Text pb={10} size="lg" c="white">
                {t(
                  "Trade crypto and win big, just like a pro.Simple. Smart. Secure.",
                )}
              </Text>
              <Grid>
                <Grid.Col span={6}>
                  <Input
                    size="xl"
                    variant="default"
                    placeholder="Email or Phone Number"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <AppButton size="xl">Sign Up</AppButton>
                </Grid.Col>
              </Grid>
            </Box>
            <Box maw={400}>
              <Box
                maw={400}
                w={"100%"}
                onWaiting={() => {
                  // TODO
                }}
                mx={"auto"}
              >
                <Image
                  mx={"auto"}
                  maw={"100%"}
                  src={
                    "https://static-prod.omtrade.com/w-static/_next/static/media/home-bg.c8f0c5a4.png"
                  }
                />
              </Box>
            </Box>
          </Flex>
        </Container>
      </Box>
    </>
  );
}

function SliderNotice() {
  return (
    <>
      <Box h={52} className={classes.contentmarquee}>
        <Container h="100%" size="xl">
          <Group align="center" h="100%">
            <MarqueeList>
              <Text fw={700} px={10} c="black">
                Crypto Cup 2024 Pre-Game: Train & Win 50,000 USDT in
                Football Rewards!
              </Text>
              <Text fw={700} px={10} c="black">
                Crypto Cup 2024 Pre-Game: Train & Win 50,000 USDT in
                Football Rewards!
              </Text>
              <Text fw={700} px={10} c="black">
                Crypto Cup 2024 Pre-Game: Train & Win 50,000 USDT in
                Football Rewards!
              </Text>
            </MarqueeList>
          </Group>
        </Container>
      </Box>
    </>
  );
}

function TableBar(props: { items: Gainer[] }) {
  const fields = [
    {
      name: "token",
      text: "Trading Pairs",
    },
    {
      name: "price",
      text: "Last Traded Price",
    },
    {
      name: "change",
      text: "24H Change",
    },
    {
      name: "Charts",
      text: "Charts",
    },
    {
      name: "Trade",
      text: "Trade",
    },
  ];
  return (
    <AppTable
      fields={fields}
      items={props.items}
      fieldTemplate={renderCell}
    />
  );
}

function renderCell(
  field: {
    name: string;
    text: string;
  },
  element: Gainer,
) {
  if (field.name == "token") {
    return (
      <Group align="center" gap={"sm"}>
        <Avatar size={28} src={element.icon}></Avatar>
        <AppText instancetype="WithCellToken">
          {element.token}
        </AppText>
      </Group>
    );
  }
  if (field.name == "price") {
    return (
      <AppText instancetype="WithCellToken">
        {element.lastPrice}
      </AppText>
    );
  }
  if (field.name == "change") {
    return (
      <AppText
        instancetype="WithCellToken"
        c={element.change > 0 ? "green" : "red"}
      >
        {element.change > 0 ? "+" : ""}
        <NumberFormatter value={element.change} decimalScale={2} />%
      </AppText>
    );
  }
  if (field.name == "Charts") {
    let chartOptions = {
      colors: ["#ff0000"],
      fill: {
        opacity: 0.4,
        colors: ["#ff0000"], // Set màu nền cho phần fill của biểu đồ
      },
    };
    if (element.change > 0) {
      chartOptions = {
        colors: ["#00E396"],
        fill: {
          opacity: 0.4,
          colors: ["#00E396"], // Set màu nền cho phần fill của biểu đồ
        },
      };
    }
    return (
      <div>
        <AppChart
          instancetype="Sparkline"
          chartSeries={randomizeArraySparkline()}
          chartOptions={chartOptions}
        />
      </div>
    );
  }
  if (field.name == "Trade") {
    return (
      <AppButton
        instancetype="WithOutlinedColor"
        component="a"
        href={`/trade/futures/${element.base}/${element.quote}`}
      >
        Trade
      </AppButton>
    );
  }
}

function TableBarTopGainers(props: { items: Gainer[] }) {
  const fields = [
    {
      name: "token",
      text: "Trading Pairs",
    },
    {
      name: "price",
      text: "Last Traded Price",
    },
    {
      name: "change",
      text: "24H Change",
    },
  ];
  return (
    <AppTable
      fields={fields}
      items={props.items}
      fieldTemplate={renderCell}
      hideHeader
    />
  );
}

function TableBarNewListing(props: { items: Gainer[] }) {
  const fields = [
    {
      name: "token",
      text: "Trading Pairs",
    },
    {
      name: "price",
      text: "Last Traded Price",
    },
    {
      name: "change",
      text: "24H Change",
    },
  ];
  return (
    <AppTable
      fields={fields}
      items={props.items}
      fieldTemplate={renderCell}
      hideHeader
    />
  );
}

const items = [...Array(20)];
function TrendingTraders() {
  const t = useSPETranslation();
  return (
    <div>
      <Title order={2}>Trending traders</Title>
      <Title order={5}>
        {
          "Find your favorite master. Invest along the best. It's simple"
        }
        - when they profit, you do too.
      </Title>
      <Space h={"md"} />
      <Card radius={"lg"} py={60}>
        <Grid gutter={{ base: 5, xs: "md", md: "xl", xl: 10 }}>
          <Grid.Col span={3}>
            <Card radius="md" h={"100%"}>
              <Center h={"100%"}>
                <Box>
                  <Title order={3}>Copy Trading</Title>
                  <Title order={5} c={"gray"} fw={"normal"}>
                    Let top traders work for you
                  </Title>
                  <Space h={"md"} />
                  <Flex justify={"space-between"}>
                    <Box>
                      <Title order={3}>106K+</Title>
                      <Title order={5} c={"gray"} fw={"normal"}>
                        Master Traders
                      </Title>
                    </Box>
                    <Box>
                      <Title order={3}>832K+</Title>
                      <Title order={5} c={"gray"} fw={"normal"}>
                        Followers
                      </Title>
                    </Box>
                  </Flex>
                  <Space h={"xl"} />
                  <AppButton instancetype="WithRightIcon" size="md">
                    View All Masters
                  </AppButton>
                </Box>
              </Center>
            </Card>
          </Grid.Col>
          <Grid.Col span={9}>
            <Card>
              <MarqueeList speed={100}>
                {items.map((_, _k) => (
                  <Card
                    key={_k}
                    padding="lg"
                    radius="md"
                    mx={5}
                    bg={alpha("gray", 0.03)}
                    withBorder
                  >
                    <Flex gap={"md"} align={"center"}>
                      <Box>
                        <Avatar
                          size={44}
                          src={
                            "https://www.bybit.com/bycsi-root/fop/copytrade/d4b50bbb-a63f-4675-808a-5b60ae5cdf22.jpg?quality=50&format=avif&resize=width/44"
                          }
                        />
                      </Box>
                      <Box>
                        <Title order={5}>GlimmerGrace</Title>
                        <Text c={"gray"}>24 Followers</Text>
                      </Box>
                    </Flex>
                    <Space h={"md"} />
                    <Box>
                      <Box>
                        <Title order={6} fw={"normal"} c={"gray"}>
                          7D ROI
                        </Title>
                        <Title order={4} fw={"bold"}>
                          394.80%
                        </Title>
                      </Box>
                      <Space h={"sm"} />
                      <Box>
                        <Title order={6} fw={"normal"} c={"gray"}>
                          {"7D followers' Pnl"}
                        </Title>
                        <Title order={4} fw={"bold"}>
                          1,9444.23
                        </Title>
                      </Box>
                    </Box>
                    <Space h={"md"} />
                    <AppButton
                      instancetype="GhostWithRightIcon"
                      size="lg"
                    >
                      {t("Copy")}
                    </AppButton>
                    <AppPill />
                  </Card>
                ))}
              </MarqueeList>
            </Card>
          </Grid.Col>
        </Grid>
      </Card>
    </div>
  );
}

function QuickStart() {
  const t = useSPETranslation();
  const navigate = useNavigate();

  return (
    <>
      <Card radius={"lg"} py={60}>
        <Grid>
          <Grid.Col span={6}>
            <Center h={"100%"}>
              <Box>
                <Title order={1}>{t("Get Started in Minutes")}</Title>
                <Space h={30} />
                <Group justify="center">
                  <AppButton
                    size="xl"
                    loaderProps={{ type: "bars" }}
                    instancetype="WithRightIcon"
                    onClick={() => navigate("/register")}
                  >
                    {t("Start Now")}
                  </AppButton>
                </Group>
              </Box>
            </Center>
          </Grid.Col>
          <Grid.Col span={6}>
            <Timeline bulletSize={40} active={3}>
              <Timeline.Item
                bullet={<Title order={3}>1</Title>}
                title={
                  <Title order={3} lineClamp={10}>
                    {t(
                      "Create a free %s Account.",
                      localStorage.__APP_NAME__,
                    )}{" "}
                  </Title>
                }
              >
                <Text>
                  {t(
                    "Create a free %s Account.",
                    localStorage.__APP_NAME__,
                  )}
                </Text>
              </Timeline.Item>

              <Timeline.Item
                bullet={<Title order={3}>2</Title>}
                title={
                  <Title order={3} lineClamp={10}>
                    {t(
                      "Find master traders that best serve your financial goals.",
                    )}
                  </Title>
                }
              >
                <Text>
                  {t(
                    "Create a free %s Account.",
                    localStorage.__APP_NAME__,
                  )}
                </Text>
              </Timeline.Item>
              <Timeline.Item
                bullet={<Title order={3}>3</Title>}
                title={
                  <Title order={3} lineClamp={10}>
                    {t(
                      "Start copy trading and watch your portfolio grow!",
                    )}
                  </Title>
                }
              >
                <Text>
                  {t(
                    "Create a free %s Account.",
                    localStorage.__APP_NAME__,
                  )}
                </Text>
              </Timeline.Item>
            </Timeline>
          </Grid.Col>
        </Grid>
      </Card>
    </>
  );
}

function PartnerSection() {
  const items = [
    "https://www.omtrade.com/_next/image?url=https%3A%2F%2Fstatic-prod.omtrade.com%2Fw-static%2F_next%2Fstatic%2Fmedia%2FIncuba.ad4be468.png&w=256&q=100",
    "https://www.omtrade.com/_next/image?url=https%3A%2F%2Fstatic-prod.omtrade.com%2Fw-static%2F_next%2Fstatic%2Fmedia%2FMeteorite.82d8b227.png&w=384&q=100",
    "https://www.omtrade.com/_next/image?url=https%3A%2F%2Fstatic-prod.omtrade.com%2Fw-static%2F_next%2Fstatic%2Fmedia%2FKSK.9a4c96b2.png&w=384&q=100",
    "https://www.omtrade.com/_next/image?url=https%3A%2F%2Fstatic-prod.omtrade.com%2Fw-static%2F_next%2Fstatic%2Fmedia%2FBloomberg-black.c7228817.png&w=384&q=100",
    "https://www.omtrade.com/_next/image?url=https%3A%2F%2Fstatic-prod.omtrade.com%2Fw-static%2F_next%2Fstatic%2Fmedia%2FVector.5f71abbb.png&w=256&q=100",
    "https://www.omtrade.com/_next/image?url=https%3A%2F%2Fstatic-prod.omtrade.com%2Fw-static%2F_next%2Fstatic%2Fmedia%2FLayer-black.058d4ea8.png&w=384&q=100",
  ];
  return (
    <>
      <Box style={{ overflow: "hidden" }} w={"100%"}>
        <MarqueeList speed={90} loop={1000} pauseOnHover={false}>
          {items.map((img, _k) => (
            <Box opacity={0.4} mx={"xl"} key={_k}>
              <Image src={img} />
            </Box>
          ))}
        </MarqueeList>
      </Box>
    </>
  );
}
