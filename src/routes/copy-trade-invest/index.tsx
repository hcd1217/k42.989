import allTradersIcon from "@/assets/images/all-traders.svg";
import topTradersIcon from "@/assets/images/top-traders.svg";
import { shuffle } from "@/common/utils";
import useSPETranslation from "@/hooks/useSPETranslation";
import { fetchAllTraders } from "@/services/apis";
import logger from "@/services/logger";
import authStore from "@/store/auth";
import { CopyMaster } from "@/types";
import AppButton from "@/ui/Button/AppButton";
import { CardTrader, CardTraderTop1 } from "@/ui/CardCopyTrades";
import { AppCarousel } from "@/ui/Carousel/Carousel";
import NumberFormat from "@/ui/NumberFormat";
import { OptionFilter } from "@/ui/OptionFilter";
import { SPELoading } from "@/ui/SPEMisc";
import AppText from "@/ui/Text/AppText";
import { debounceBuilder } from "@/utils/utility";
import { Carousel } from "@mantine/carousel";
import {
  Box,
  Button,
  Card,
  Center,
  Checkbox,
  Container,
  Divider,
  Flex,
  Group,
  Image,
  Input,
  SegmentedControl,
  SimpleGrid,
  Space,
  Tabs,
  Text,
  Title,
  lighten,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { IconEye, IconEyeOff, IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import classes from "./index.module.scss";

type Tab = "TOP" | "ALL";

const sizeContainer = "xl";

const filterTraders = debounceBuilder(
  (
    traders: CopyMaster[],
    keyword: string,
    setFilteredTraders: (_: CopyMaster[]) => void,
  ) => {
    logger.debug("filter...", keyword);
    if (!keyword) {
      setFilteredTraders(traders);
    } else {
      setFilteredTraders(
        traders.filter((el) => {
          return el.name
            .toLowerCase()
            .includes(keyword.toLowerCase());
        }),
      );
    }
  },
  100,
);

export default function CopyTrade() {
  const t = useSPETranslation();
  const [traders, setTraders] = useState<CopyMaster[]>([]);
  // prettier-ignore
  const [filteredTraders, setFilteredTraders] = useState<CopyMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("TOP");
  const [keyword, setKeyword] = useState("");
  const [sortKey, setSortKey] =
    useState<keyof CopyMaster>("pnlRatio");

  useEffect(() => {
    filterTraders(traders, keyword, setFilteredTraders);
  }, [traders, keyword]);

  useEffect(() => {
    fetchAllTraders().then((traders) => {
      setTraders(traders);
      setFilteredTraders(traders);
      setTimeout(setLoading, 300, false);
    });
  }, []);

  return (
    <>
      {loading && <SPELoading />}
      <Banner />
      <Tabs
        keepMounted
        value={tab}
        classNames={classes}
        onChange={(v) => setTab(v as Tab)}
      >
        <Box
          style={{ position: "sticky", top: 0, left: 0, zIndex: 9 }}
          className={classes.boxSticky}
        >
          <Container size={sizeContainer}>
            <Flex
              justify={"space-between"}
              w={"100%"}
              wrap={{ xs: "wrap", sm: "nowrap" }}
            >
              <Tabs.List w={{ xs: "100%", sm: "auto" }}>
                <Tabs.Tab
                  w={"50%"}
                  value={"TOP"}
                  leftSection={
                    <Image
                      visibleFrom="md"
                      width={30}
                      src={topTradersIcon}
                    />
                  }
                >
                  <AppText
                    instancetype="TabText"
                    fz={{
                      xs: "16px",
                      md: "20px",
                    }}
                  >
                    {t("Top Master Traders")}
                  </AppText>
                </Tabs.Tab>
                <Tabs.Tab
                  w={"50%"}
                  value="ALL"
                  leftSection={
                    <Image
                      visibleFrom="md"
                      width={30}
                      src={allTradersIcon}
                    />
                  }
                >
                  <AppText
                    instancetype="TabText"
                    fz={{ xs: "16px", md: "20px" }}
                    onClick={() => setTab("ALL")}
                  >
                    {t("All Master Traders")}
                  </AppText>
                </Tabs.Tab>
              </Tabs.List>
              <Flex
                py={{ xs: 10, sm: "0" }}
                align={"center"}
                gap={25}
                w={{ xs: "100%", sm: "auto" }}
                direction={{ xs: "row-reverse", sm: "unset" }}
              >
                {tab === "ALL" && (
                  <>
                    <Checkbox label={t("Followable")} />
                    <Box
                      flex={{
                        xs: 1,
                        sm: "auto",
                      }}
                    >
                      <Input
                        variant="filled"
                        placeholder={t("Search traders")}
                        rightSection={<IconSearch size={16} />}
                        defaultValue={keyword}
                        onChange={(e) => {
                          if (!e.currentTarget.value) {
                            setKeyword("");
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            if (e.currentTarget.value !== keyword) {
                              setKeyword(e.currentTarget.value);
                            }
                          }
                        }}
                        onBlur={(e) => {
                          if (e.currentTarget.value !== keyword) {
                            setKeyword(e.currentTarget.value);
                          }
                        }}
                      />
                    </Box>
                  </>
                )}
              </Flex>
            </Flex>
            <Divider />
          </Container>
        </Box>
        <Tabs.Panel value="TOP">
          <Box py={10}>
            <Box pb={35}>
              <Container size={sizeContainer}>
                <Group justify="space-between" align="center">
                  <Box>
                    <AppText instancetype="WithTitleSectionTrade">
                      {t("Highest PnL%")}
                    </AppText>
                    <AppText instancetype="WithSubTitleSectionTrade">
                      {t(
                        "Maximize returns: Copy the top masters in percentage leader-board",
                      )}
                    </AppText>
                  </Box>
                  <ViewMore onClick={() => setTab("ALL")} />
                </Group>
                <Flex>
                  <Box w={"100%"}>
                    {traders.length && (
                      <AppCarousel>
                        {_sort(
                          traders.filter((el) => {
                            if (keyword) {
                              return el.name
                                .toLowerCase()
                                .includes(keyword.toLowerCase());
                            }
                            return true;
                          }),
                          "pnlRatio",
                          10,
                        ).map((trader) => (
                          <Carousel.Slide
                            key={trader.masterAccountId}
                          >
                            <CardTraderTop1 {...trader} />
                          </Carousel.Slide>
                        ))}
                      </AppCarousel>
                    )}
                  </Box>
                </Flex>
              </Container>
            </Box>
            <Box py={35} className={classes.bgGradient}>
              <Container size={sizeContainer}>
                <Group justify="space-between" align="center">
                  <Box>
                    <AppText instancetype="WithTitleSectionTrade">
                      {t("Highest Abs. PnL")}
                    </AppText>
                    <AppText instancetype="WithSubTitleSectionTrade">
                      {t(
                        "Leaders in absolute profit: Your pathway to substantial gains",
                      )}
                    </AppText>
                  </Box>
                  <ViewMore onClick={() => setTab("ALL")} />
                </Group>
                <Flex>
                  <Box w={"100%"}>
                    {traders.length && (
                      <AppCarousel className="app-carousel-orange">
                        {_sort(traders, "profit", 10).map(
                          (trader) => (
                            <Carousel.Slide
                              key={trader.masterAccountId}
                            >
                              <CardTrader {...trader} />
                            </Carousel.Slide>
                          ),
                        )}
                      </AppCarousel>
                    )}
                  </Box>
                </Flex>
              </Container>
            </Box>
            <Box py={35}>
              <Container size={sizeContainer}>
                <Group justify="space-between" align="center">
                  <Box>
                    <AppText instancetype="WithTitleSectionTrade">
                      {t("Highest Win Rate")}
                    </AppText>
                    <AppText instancetype="WithSubTitleSectionTrade">
                      {t(
                        "Consistent success: Masters with the highest win ratios",
                      )}
                    </AppText>
                  </Box>
                  <ViewMore onClick={() => setTab("ALL")} />
                </Group>
                <Flex>
                  <Box w={"100%"}>
                    {traders.length && (
                      <AppCarousel>
                        {_sort(traders, "winRate", 10).map(
                          (trader) => (
                            <Carousel.Slide
                              key={trader.masterAccountId}
                            >
                              <CardTrader {...trader} />
                            </Carousel.Slide>
                          ),
                        )}
                      </AppCarousel>
                    )}
                  </Box>
                </Flex>
              </Container>
            </Box>
            <Box pb={35}>
              <Container size={sizeContainer}>
                <AppButton
                  variant="light"
                  size="md"
                  fullWidth
                  instancetype="WithRightIcon"
                  onClick={() => setTab("ALL")}
                >
                  {t("View All Master Traders")}
                </AppButton>
              </Container>
            </Box>
          </Box>
        </Tabs.Panel>
        <Tabs.Panel value="ALL">
          <Container size={sizeContainer}>
            <Box py={10}>
              <Flex gap={{ xs: 20, sm: 3, md: 20 }} align={"center"}>
                <Box>
                  <OptionFilter
                    value="Overview"
                    menuProps={{
                      trigger: "hover",
                    }}
                    label={t("Overview")}
                    items={[
                      {
                        label: t("Overview"),
                        value: "Overview",
                      },
                      {
                        label: t("Daily Settlement"),
                        value: "Daily Settlement",
                      },
                      {
                        label: t("High-Water Mark"),
                        value: "High-Water Mark",
                      },
                    ]}
                  />
                </Box>
                <Box>
                  <Divider
                    orientation="vertical"
                    h={"20px"}
                    bg={"red"}
                    c={"red"}
                  />
                </Box>
                <SegmentedControl
                  onChange={(v) => {
                    setSortKey((v || "pnlRatio") as keyof CopyMaster);
                  }}
                  visibleFrom="sm"
                  withItemsBorders={false}
                  size="xs"
                  styles={{
                    root: {
                      background: "none",
                    },
                  }}
                  color={"primary"}
                  data={[
                    [t("PnL%"), "pnlRatio"],
                    [t("Abs. PnL"), "profit"],
                    // [t("Followers"), ""],
                    [t("Win Rate"), "winRate"],
                    [t("Drawdown"), "drawDown"],
                    [t("Avg. `PnL"), "avgPnl"],
                    [t("Avg. Holding Period"), "avgHoldingTime"],
                    [t("Trading Frequency"), "weekLyTrade"],
                  ].map(([label, value]) => ({ label, value }))}
                />
                <Box hiddenFrom="sm">
                  <OptionFilter
                    menuProps={{
                      trigger: "hover",
                    }}
                    label="Trader Types"
                    items={[
                      "PnL%",
                      "Abs. PnL",
                      "Followers",
                      "Win Rate",
                      "Drawdown",
                      "Avg. PnL",
                      "Avg. Holding Period",
                      "Trading Frequency",
                    ].map((el) => ({
                      label: t(el),
                      value: el,
                    }))}
                  />
                </Box>
              </Flex>
            </Box>
            <Box mb={30}>
              <SimpleGrid
                py={30}
                cols={{
                  xs: 1,
                  sm: 2,
                  md: 3,
                  lg: 3,
                  xl: 4,
                }}
              >
                {filteredTraders.length ? (
                  _sort(filteredTraders, sortKey).map((trader) => (
                    <CardTrader
                      key={trader.masterAccountId}
                      {...trader}
                    />
                  ))
                ) : (
                  <></>
                )}
              </SimpleGrid>
            </Box>
          </Container>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}

function Banner() {
  const t = useSPETranslation();
  const { me } = authStore();
  const navigate = useNavigate();
  const [isOffPrice, togglePrice] = useToggle([true, false]);

  return (
    <Box className="banner-copy">
      <Center w={"100%"} h={"100%"}>
        <Container size={sizeContainer} w={"100%"}>
          <Flex
            justify={"space-between"}
            gap={20}
            wrap={{
              xs: "wrap",
              sm: "nowrap",
            }}
          >
            <Box>
              <Center h={"100%"}>
                <Box>
                  <Text className="textWithCopy">
                    {t("Copy Trading")}
                  </Text>
                  <AppText
                    fz={24}
                    c={lighten("black", 1)}
                    instancetype="BannerTextSub"
                  >
                    {t(
                      "Earning with ease by copying the moves of top traders.",
                    )}
                  </AppText>
                  <Space mb={20} />
                  <Flex gap={20}>
                    {me?.isCopyMaster ? (
                      <AppButton
                        size="md"
                        instancetype="WithRightIcon"
                        onClick={() =>
                          navigate("/copy/master/positions")
                        }
                      >
                        {t("My Master Dashboard")}
                      </AppButton>
                    ) : (
                      <AppButton
                        size="md"
                        instancetype="WithRightIcon"
                        onClick={() =>
                          navigate("/inquiry?type=CopyMaster")
                        }
                      >
                        {t("Become a Master")}
                      </AppButton>
                    )}
                  </Flex>
                </Box>
              </Center>
            </Box>
            <Card
              pos={"relative"}
              w={{
                xs: "100%",
                sm: 394,
              }}
              mih={"176px"}
              radius={12}
              p={0}
              c={"white"}
              bd={"1px solid rgba(178,203,221, .3)"}
              bg={
                "linear-gradient(289.57deg,rgba(15,19,35,.2) 6.82%,hsla(0,0%,100%,.092) 79.78%)"
              }
            >
              <Box
                style={{
                  padding: "20px 18px",
                }}
                pos={"relative"}
              >
                <Flex align={"center"} gap={10}>
                  <AppText fz={"20px"} fw={"bold"}>
                    {t("My Copy Trading")}
                  </AppText>
                  <Box>
                    <Button
                      c={"white"}
                      p={0}
                      m={0}
                      variant="transparent"
                      onClick={() => togglePrice()}
                    >
                      {isOffPrice ? <IconEyeOff /> : <IconEye />}
                    </Button>
                  </Box>
                </Flex>
                <Space my={"sm"} />
                <Flex gap={40}>
                  <Box>
                    <Text fz={12} c={"dimmed"}>
                      {t("Unrealized PnL(USDT)")}
                    </Text>
                    <Title order={4}>
                      <NumberFormat
                        value={0}
                        decimalPlaces={2}
                        hidden={isOffPrice}
                      />
                    </Title>
                  </Box>
                  <Box>
                    <Text fz={12} c={"dimmed"}>
                      {t("Total Assets(USDT)")}
                    </Text>
                    <Title order={4}>
                      <NumberFormat
                        value={0}
                        decimalPlaces={2}
                        hidden={isOffPrice}
                      />
                    </Title>
                  </Box>
                </Flex>
                <Space my={"sm"} />
                <Link
                  style={{
                    all: "unset",
                    display: "block",
                  }}
                  to={"/copy/mine/traders"}
                >
                  <AppButton
                    fullWidth
                    variant="gradient"
                    gradient={{
                      from: "primary",
                      to: "yellow",
                      deg: 90,
                    }}
                  >
                    {t("View More")}
                  </AppButton>
                </Link>
              </Box>
            </Card>
          </Flex>
        </Container>
      </Center>
    </Box>
  );
}

function ViewMore({ onClick }: { onClick: () => void }) {
  const t = useSPETranslation();
  return (
    <AppButton
      variant="transparent"
      instancetype="WithRightIcon"
      size="lg"
      fw={"bold"}
      onClick={onClick}
    >
      {t("View More")}
    </AppButton>
  );
}

function _sort<T>(arr: T[], key: keyof T, total?: number) {
  return shuffle(arr)
    .sort((a, b) => {
      return (b[key] as number) - (a[key] as number);
    })
    .slice(0, total || arr.length);
}
