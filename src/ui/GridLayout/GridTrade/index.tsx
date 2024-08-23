import BN from "@/common/big-number";
import useSPEInterval from "@/hooks/useSPEInterval";
import useSPETranslation from "@/hooks/useSPETranslation";
import { assetStore } from "@/store/assets";
import authStore from "@/store/auth";
import tradeStore from "@/store/trade";
import { GridTradeProps } from "@/types";
import AppButton from "@/ui/Button/AppButton";
import NumberFormat from "@/ui/NumberFormat";
import OrderForm from "@/ui/OrderForm";
import { AppPopover } from "@/ui/Popover/AppPopover";
import AppText from "@/ui/Text/AppText";
import { TVChart } from "@/ui/TvChart";
import { DepositForm, SwapForm, TransferForm } from "@/ui/Wallet";
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Grid,
  InputLabel,
  SimpleGrid,
  Space,
  Spoiler,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconChevronsDown,
  IconChevronsUp,
  IconGripHorizontal,
} from "@tabler/icons-react";
import { useCallback, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useMediaQuery } from "usehooks-ts";
import { OrderBook, TabsOfTradeHistory, TopBar } from "../components";

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const initialLayouts = {
  lg: [
    {
      x: 4,
      y: 0,
      w: 2,
      h: 5,
      i: "0",
      static: false,
    },
    {
      x: 8,
      y: 0,
      w: 2,
      h: 5,
      i: "1",
      static: false,
    },
    {
      x: 6,
      y: 0,
      w: 2,
      h: 4,
      i: "2",
      static: false,
    },
  ],
  md: [
    {
      w: 7,
      h: 20,
      x: 0,
      y: 0,
      i: "0",
      moved: false,
      static: false,
    },
    {
      w: 3,
      h: 20,
      x: 7,
      y: 0,
      i: "1",
      moved: false,
      static: false,
    },
    {
      w: 10,
      h: 8,
      x: 0,
      y: 20,
      i: "2",
      moved: false,
      static: false,
    },
  ],
};
const initLayout = JSON.stringify(initialLayouts);
export function GridTrade({
  base,
  quote,
  symbol,
  isSpot = false,
  isFuture = false,
}: GridTradeProps) {
  const t = useSPETranslation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [layouts, setLayouts] = useState(
    localStorage.__TRADE_LAYOUT__
      ? JSON.parse(localStorage.__TRADE_LAYOUT__)
      : initialLayouts,
  );

  const [customLayout, setCustomLayout] = useState(false);

  const onLayoutChange = useCallback(
    (_: unknown, layouts: unknown) => {
      if (layouts) {
        setLayouts(layouts);
        if (JSON.stringify(layouts) !== initLayout) {
          setCustomLayout(true);
          localStorage.__TRADE_LAYOUT__ = JSON.stringify(layouts);
        }
      }
    },
    [],
  );

  useSPEInterval(() => {
    tradeStore.getState().loadOpenTrades();
    tradeStore.getState().loadMarketInformation(symbol);
  }, 10e3);

  return (
    <Grid columns={24} gutter={4} p={4} key={symbol}>
      <Grid.Col
        span={{
          xs: 24,
          sm: 16,
          lg: 19,
        }}
      >
        <Grid gutter={4}>
          <Grid.Col
            style={{
              position: "relative",
            }}
          >
            <TopBar
              isFuture={isFuture}
              isSpot={isSpot}
              symbol={symbol}
              base={base}
              quote={quote}
            />
            <Button
              variant="outline"
              size="xs"
              fz={10}
              hidden={isMobile}
              h={"15px"}
              onClick={() => {
                delete localStorage.__TRADE_LAYOUT__;
                setLayouts(initialLayouts);
                setCustomLayout(false);
              }}
              px={"5px"}
              style={{
                display:
                  isMobile || !customLayout ? "none" : undefined,
                position: "absolute",
                bottom: 2,
                right: 0,
              }}
            >
              {t("Reset layout")}
            </Button>
          </Grid.Col>
          <Grid.Col>
            <ResponsiveReactGridLayout
              className="layout_trade"
              rowHeight={30}
              onLayoutChange={onLayoutChange}
              measureBeforeMount={false}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              margin={[4, 4]}
              containerPadding={[0, 0]}
              layouts={layouts}
              draggableHandle=".grid-item-drag-handle"
            >
              <div key={0} className="grid-item-box">
                <TVChart base={base} quote={quote} isSpot={isSpot} />
                <div className="grid-item-drag-handle">
                  <ActionIcon size={"xs"} variant="light">
                    <IconGripHorizontal size={18} />
                  </ActionIcon>
                </div>
              </div>
              <div key={1} className="grid-item-box">
                <OrderBook {...{ base, quote, symbol, isSpot }} />
                <div className="grid-item-drag-handle">
                  <ActionIcon size={"xs"} variant="light">
                    <IconGripHorizontal size={18} />
                  </ActionIcon>
                </div>
              </div>
              <div key={2} className="grid-item-box">
                <TabsOfTradeHistory
                  isFuture={isFuture}
                  isSpot={isSpot}
                  symbol={symbol}
                  base={base}
                  quote={quote}
                />
                <div className="grid-item-drag-handle">
                  <ActionIcon size={"xs"} variant="light">
                    <IconGripHorizontal size={18} />
                  </ActionIcon>
                </div>
              </div>
            </ResponsiveReactGridLayout>
          </Grid.Col>
        </Grid>
      </Grid.Col>
      <Grid.Col
        span={{
          xs: 24,
          sm: 8,
          lg: 5,
        }}
      >
        <OrderPanel
          symbol={symbol}
          base={base}
          quote={quote}
          isFuture={isFuture}
          isSpot={isSpot}
        />
      </Grid.Col>
    </Grid>
  );
}

function OrderPanel(props: GridTradeProps) {
  return (
    <Box
      className="bg-trade space-y-10"
      h={"100%"}
      py={0}
      pt={10}
      px={10}
    >
      <Space mt={10} />
      <OrderForm {...props} />
      <BoxInfoTradeFoot {...props} />
    </Box>
  );
}

function BoxInfoTradeFoot({
  symbol,
  isSpot,
  base,
  quote,
}: GridTradeProps) {
  const t = useSPETranslation();
  const { marketInformation } = tradeStore();
  const { isLogin } = authStore();
  const { tradingBalanceMap, tradingAccount, fundingAccount } =
    assetStore();

  return (
    <Box className="space-y-20" mt={50}>
      <Flex justify={"space-between"}>
        <AppText fz={14} fw={"bold"}>
          {t("Trading Account")}
        </AppText>
      </Flex>
      <Box h={"1"} className="border-bottom-dark"></Box>
      <Box className="space-y-10">
        <Flex justify={"space-between"} align={"center"}>
          <AppPopover
            withArrow={false}
            target={(props) => ({
              children: (
                <AppText
                  onMouseLeave={props.close}
                  style={{
                    cursor: "pointer",
                  }}
                  onMouseEnter={props.open}
                  fz={12}
                >
                  {t("Margin Balance")}
                </AppText>
              ),
            })}
            dropdown={() => ({
              children: (
                <div>
                  <AppText
                    instancetype="WithTextTooltip"
                    styles={{
                      root: {
                        whiteSpace: "pre-line",
                      },
                    }}
                  >
                    {t(
                      "Margin Balance = Wallet Balance + Unrealized P&L (Perpetual + Futures)",
                    )}
                    <br />
                    {t(
                      "Liquidation will be triggered when margin balance falls below the maintenance margin.",
                    )}{" "}
                    <br />
                    {t(
                      "Initial Margin Rate (IMR) = Initial Margin / (Margin Balance - Haircut Loss) * 100%",
                    )}{" "}
                    <br />
                    <br />
                    {t(
                      "Margin balance under the Unified Trading Account is denominated in %, calculated in real time based on the total assets in the account.",
                      quote,
                    )}
                  </AppText>
                </div>
              ),
            })}
          ></AppPopover>
          <AppText fw={"bold"} fz={12}>
            <NumberFormat
              value={BN.add(tradingBalanceMap[quote]?.equity || 0)}
            />{" "}
            {quote}
          </AppText>
        </Flex>
        <Flex justify={"space-between"} align={"center"}>
          <AppPopover
            withArrow={false}
            target={(props) => ({
              children: (
                <AppText
                  onMouseLeave={props.close}
                  style={{
                    cursor: "pointer",
                  }}
                  onMouseEnter={props.open}
                  fz={12}
                >
                  {t("Available Balance")}
                </AppText>
              ),
            })}
            dropdown={() => ({
              children: (
                <div>
                  <AppText
                    instancetype="WithTextTooltip"
                    styles={{
                      root: {
                        whiteSpace: "pre-line",
                      },
                    }}
                  >
                    {t(
                      "The amount of balance that can be used to open positions.",
                    )}
                    <br />
                    {t(
                      "Available Balance = Margin Balance - Initial Margin - Haircut Loss",
                    )}
                    <br />
                    {t(
                      "Available balance under the Trading Account is denominated in %, calculated in real time based on the total assets in the account.",
                      quote,
                    )}
                  </AppText>
                </div>
              ),
            })}
          ></AppPopover>
          <AppText fw={"bold"} fz={12}>
            <NumberFormat
              value={tradingBalanceMap[quote]?.availableMargin || 0}
            />{" "}
            {quote}
          </AppText>
        </Flex>
      </Box>
      <SimpleGrid
        cols={3}
        styles={{
          root: {
            gap: 5,
          },
        }}
      >
        <AppButton
          disabled={!isLogin}
          size="xs"
          styles={{
            root: {
              background: "light-dark(#e9edf3, #414347)",
              color: "light-dark(black, white)",
            },
          }}
          onClick={() => {
            modals.open({
              size: "lg",
              centered: true,
              styles: {
                header: {
                  display: "none",
                },
                content: {
                  padding: 0,
                  background: "none",
                },
                body: {
                  padding: 0,
                  background: "none",
                },
                close: {
                  display: "none",
                },
                root: {
                  width: "100%",
                  padding: 0,
                  background: "none",
                },
              },
              children: <DepositForm coin={quote} />,
            });
          }}
        >
          {t("Deposit")}
        </AppButton>
        <AppButton
          disabled={!isLogin}
          size="xs"
          styles={{
            root: {
              background: "light-dark(#e9edf3, #414347)",
              color: "light-dark(black, white)",
            },
          }}
          onClick={() => {
            modals.open({
              size: "lg",
              centered: true,
              styles: {
                header: {
                  display: "none",
                },
                content: {
                  padding: 0,
                  background: "none",
                },
                body: {
                  padding: 0,
                  background: "none",
                },
                root: {
                  width: "100%",
                  padding: 0,
                  background: "none",
                },
              },
              children: (
                <SwapForm
                  coin={quote}
                  onSubmit={() => {
                    assetStore.getState().fetchBalances();
                    modals.closeAll();
                  }}
                />
              ),
            });
          }}
        >
          {t("Convert")}
        </AppButton>
        <AppButton
          disabled={!isLogin}
          size="xs"
          styles={{
            root: {
              background: "light-dark(#e9edf3, #414347)",
              color: "light-dark(black, white)",
            },
          }}
          onClick={() => {
            modals.open({
              size: "lg",
              centered: true,
              styles: {
                header: {
                  display: "none",
                },
                content: {
                  padding: 0,
                },
                body: {
                  padding: 0,
                },
                root: {
                  width: "100%",
                  padding: 0,
                },
              },
              children: (
                <TransferForm
                  coin={quote}
                  accountIds={[
                    fundingAccount?.id || "",
                    tradingAccount?.id || "",
                  ]}
                  onSubmit={() => {
                    assetStore.getState().fetchBalances();
                    modals.closeAll();
                  }}
                />
              ),
            });
          }}
        >
          {t("Transfer")}
        </AppButton>
      </SimpleGrid>
      <Box h={"1"} className="border-bottom-dark"></Box>
      <Box className="space-y-16" hidden={isSpot}>
        <Box>
          <AppText fz={16} fw={"bold"}>
            {t("Contract Details")} {symbol}
          </AppText>
        </Box>
        <Spoiler
          maxHeight={72}
          styles={{
            control: {
              width: "100%",
              textDecoration: "none",
              marginTop: "20px",
              cursor: "pointer",
              color: "gray",
            },
          }}
          showLabel={
            <Flex align={"center"} w={"100%"} justify={"center"}>
              <InputLabel fz={12} color="red">
                Show
              </InputLabel>
              <IconChevronsDown size={18} />
            </Flex>
          }
          hideLabel={
            <Flex
              align={"center"}
              w={"100%"}
              justify={"center"}
              style={{ cursor: "pointer" }}
            >
              <InputLabel fz={12} color="red">
                Hide
              </InputLabel>
              <IconChevronsUp size={18} />
            </Flex>
          }
        >
          <SimpleGrid
            cols={2}
            styles={{
              root: {
                gap: 5,
              },
            }}
          >
            <Box>
              <AppText c={"#71757a"} fw={"bold"} fz={12}>
                {t("Expiration Date")}
              </AppText>
            </Box>
            <Box>
              <AppText
                fw={"bold"}
                fz={12}
                styles={{
                  root: {
                    textAlign: "right",
                  },
                }}
              >
                {t("Perpetual")}
              </AppText>
            </Box>
            <Box>
              <AppText c={"#71757a"} fw={"bold"} fz={12}>
                {t("Index Price")}
              </AppText>
            </Box>
            <Box>
              <AppText
                fw={"bold"}
                fz={12}
                styles={{
                  root: {
                    textAlign: "right",
                  },
                }}
              >
                <NumberFormat
                  value={marketInformation[symbol]?.indexPrice || 0}
                  decimalPlaces={2}
                />
              </AppText>
            </Box>
            <Box>
              <AppText c={"#71757a"} fw={"bold"} fz={12}>
                {t("Mark Price")}
              </AppText>
            </Box>
            <Box>
              <AppText
                fw={"bold"}
                fz={12}
                styles={{
                  root: {
                    textAlign: "right",
                  },
                }}
              >
                <NumberFormat
                  value={marketInformation[symbol]?.markPrice || 0}
                  decimalPlaces={2}
                />
              </AppText>
            </Box>
            <Box>
              <AppText c={"#71757a"} fw={"bold"} fz={12}>
                {t("Open Interest")}
              </AppText>
            </Box>
            <Box>
              <AppText
                fw={"bold"}
                fz={12}
                styles={{
                  root: {
                    textAlign: "right",
                  },
                }}
              >
                {/* <NumberFormat
                  value={marketInformation[symbol]?.openInterest || 0}
                  decimalPlaces={2}
                />
                {base} */}
                {t("N/A")}
              </AppText>
            </Box>
            <Box>
              <AppText c={"#71757a"} fw={"bold"} fz={12}>
                {t("24H Turnover")}
              </AppText>
            </Box>
            <Box>
              <AppText
                fw={"bold"}
                fz={12}
                styles={{
                  root: {
                    textAlign: "right",
                  },
                }}
              >
                {/* <NumberFormat
                  value={marketInformation[symbol]?.turnOver || 0}
                  decimalPlaces={2}
                />
                {base} */}
                {t("N/A")}
              </AppText>
            </Box>
            <Box>
              <AppText c={"#71757a"} fw={"bold"} fz={12}>
                {t("Risk Limit")}
              </AppText>
            </Box>
            <Box>
              <AppText
                fw={"bold"}
                fz={12}
                styles={{
                  root: {
                    textAlign: "right",
                  },
                }}
              >
                2,000,000 {quote}
              </AppText>
            </Box>
            <Box>
              <AppText c={"#71757a"} fw={"bold"} fz={12}>
                {t("Contract Value")}
              </AppText>
            </Box>
            <Box>
              <AppText
                fw={"bold"}
                fz={12}
                styles={{
                  root: {
                    textAlign: "right",
                  },
                }}
              >
                1 {base}
              </AppText>
            </Box>
          </SimpleGrid>
        </Spoiler>
      </Box>
    </Box>
  );
}
