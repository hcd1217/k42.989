import BN from "@/common/big-number";
import { ORDER_BOOK_LIMIT } from "@/common/configs";
import { OrderSide } from "@/common/enums";
import { last } from "@/common/utils";
import useSPEInterval from "@/hooks/useSPEInterval";
import useSPETranslation from "@/hooks/useSPETranslation";
import { fetchOrderBooks } from "@/services/apis";
import tradeStore from "@/store/trade";
import { formatCurrency } from "@/utils";
import {
  Box,
  Flex,
  HoverCard,
  Select,
  Space,
  Text,
} from "@mantine/core";
import {
  IconArrowDown,
  IconArrowUp,
  IconCaretDownFilled,
  IconFlagFilled,
} from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import NumberFormat from "../NumberFormat";
import { IS_DEV } from "@/domain/config";

export type OrderBookType = "ASK ONLY" | "BID ONLY" | "ASK & BID";

type X = [number, number, number, number];
type OrderBookData = {
  green: X[];
  red: X[];
  status: "newData" | "";
  latest: number;
  askRate: number;
  bidRate: number;
  side: OrderSide;
};

export function OrderBookTable({
  isSpot,
  symbol,
  base,
  quote,
  display,
}: {
  display: OrderBookType;
  isSpot?: boolean;
  base: string;
  quote: string;
  symbol: string;
}) {
  const t = useSPETranslation();
  const { marketInformation } = tradeStore();

  const [
    { green, red, status, latest, side, askRate, bidRate },
    setData,
  ] = useState<OrderBookData>({
    green: [],
    red: [],
    status: "",
    latest: 0,
    askRate: 0,
    bidRate: 0,
    side: OrderSide.BUY,
  });

  const fetch = useCallback(() => {
    fetchOrderBooks(symbol).then(({ a, b }) => {
      if (!a || !b) {
        return;
      }
      setData((data) => {
        const numberOfRow = display === "ASK & BID" ? 10 : 30;
        const latestAsk: number = last(a)?.[0] || 0;
        const latestBid: number = b?.[0]?.[0] || 0;
        let latest = data.latest;
        let side = data.side;
        if (latestBid && latestAsk) {
          if (latest < latestBid) {
            latest = latestBid;
            side = OrderSide.BUY;
          }
          if (latest > latestAsk) {
            latest = latestAsk;
            side = OrderSide.SELL;
          }
          // logger.trace("save", `__LAST_PRICE_${symbol}__`, latest);
          localStorage[`__LAST_PRICE_${symbol}__`] = latest;
          const totalAsk = a[0]?.[2] || 0;
          const totalBid = last(b)?.[2] || 0;
          const total = Number(BN.add(totalAsk, totalBid)) / 100 || 1;
          const askRate = Number(BN.div(totalAsk, total, 0));
          const bidRate = Number(BN.div(totalBid, total, 0));
          return {
            green: b.slice(0, numberOfRow),
            red: a.slice(-numberOfRow),
            status: data.status === "newData" ? "" : "newData",
            latest,
            side,
            askRate,
            bidRate,
          };
        }
        return data;
      });
    });
  }, [display, symbol]);

  useSPEInterval(fetch, IS_DEV ? 10e3 : 1e3);

  const pricePanel = useMemo(() => {
    return (
      <Flex align={"center"} gap={20} pl={5} component="div">
        <Flex align={"center"} gap={5}>
          {side === OrderSide.BUY && (
            <IconArrowUp color={"#23b26b"} fontWeight={"bold"} />
          )}
          {side === OrderSide.SELL && (
            <IconArrowDown color={"#f0444b"} fontWeight={"bold"} />
          )}

          <Text
            fw={700}
            fz={"20px"}
            c={side === OrderSide.BUY ? "#23b26b" : "#f0444b"}
          >
            <NumberFormat value={latest} decimalPlaces={2} />
          </Text>
        </Flex>
        {!isSpot && (
          <HoverCard
            width={200}
            openDelay={200}
            position="top"
            styles={{
              dropdown: {
                background: "light-dark(white, #333537)",
              },
            }}
          >
            <HoverCard.Target>
              <Flex
                align={"center"}
                gap={5}
                styles={{
                  root: {
                    cursor: "help",
                  },
                }}
              >
                <IconFlagFilled color="#f6a600" size={16} />
                <Box style={{ borderBottom: "dashed 1px #f6a600" }}>
                  <Text fw={"bolder"} fz={16} c={"#f6a600"}>
                    {marketInformation[
                      symbol
                    ]?.markPrice?.toLocaleString() || "-"}
                  </Text>
                </Box>
              </Flex>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Text fz={12}>
                {t(
                  "Mark price is derived by index price and funding rate, and reflects the fair market price. Liquidation is triggered by mark price.",
                )}
              </Text>
              {/* <Space mb={10} />
              <Text c={"#f6a600"} fz={12} className="cursor-pointer">
                {t("Click here for details")}
              </Text> */}
            </HoverCard.Dropdown>
          </HoverCard>
        )}
      </Flex>
    );
  }, [isSpot, latest, marketInformation, side, symbol, t]);

  return (
    <>
      <div className={`table-root ${status}`}>
        <div className="table-header">
          <Flex className="table-row">
            <Box className="table-cell" flex={"0 0 calc(100% / 3)"}>
              <Flex h={"24px"} pl={5} align={"center"}>
                <div className="row-item-head--text">
                  <div>
                    {t("Price")}({quote})
                  </div>
                </div>
              </Flex>
            </Box>
            <Box
              className="table-cell"
              pr={5}
              flex={"0 0 calc(100% / 3)"}
            >
              <Box h={"24px"}>
                <Box className="row-item-head--text" h={"100%"}>
                  <Flex justify={"end"} align={"center"} h={"100%"}>
                    <div>
                      {t("Volume")}({base})
                    </div>
                  </Flex>
                </Box>
              </Box>
            </Box>
            <Box
              className="table-cell"
              pr={5}
              flex={"0 0 calc(100% / 3)"}
            >
              <Box h={"24px"} pr={5}>
                <Flex justify={"end"} align={"center"}>
                  <Select
                    w={120}
                    data={[
                      `${t("Total")}(${base})`,
                      `${t("Total")}(${quote})`,
                    ]}
                    defaultValue={`${t("Total")}(${base})`}
                    withCheckIcon={false}
                    rightSection={<IconCaretDownFilled size={14} />}
                    allowDeselect={false}
                    rightSectionWidth={25}
                    size="xs"
                    classNames={{
                      root: "app-select",
                      option: "app-select-option",
                    }}
                    comboboxProps={{
                      position: "bottom",
                      offset: 0,
                      withinPortal: true,
                    }}
                    styles={{
                      input: {
                        border: "none",
                        fontSize: "12px",
                        textAlign: "right",
                        paddingTop: 0,
                        paddingBottom: 0,
                        paddingLeft: 0,
                        fontWeight: "600",
                        color: "light-dark(black, white)",
                        background: "none",
                        height: "24px",
                        minHeight: "unset",
                      },
                      option: {
                        fontSize: "12px",
                        textAlign: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                      },
                    }}
                  />
                </Flex>
              </Box>
            </Box>
          </Flex>
        </div>
      </div>
      {display !== "ASK & BID" && (
        <>
          {pricePanel}
          <Space mt={10} />
        </>
      )}
      {/* ASK */}
      <div className={`table-root ${status}`}>
        <div className="table-body">
          {display !== "ASK ONLY" &&
            red.map(([price, vol, agg], idx) => (
              <HoverCard
                openDelay={200}
                width={230}
                closeDelay={0}
                shadow="md"
                key={idx}
                position="left"
                withinPortal
                withArrow
                arrowPosition="center"
                arrowSize={14}
              >
                <HoverCard.Target>
                  <Flex className={"table-row table-row-reverse"}>
                    <Box
                      className="table-cell"
                      flex={"0 0 calc(100% / 3)"}
                    >
                      <Box pl={5}>
                        <Flex align={"center"}>
                          <div className="cell-text long">
                            <Text fz={12} c={"#f0444b"}>
                              <NumberFormat
                                value={price}
                                decimalPlaces={3}
                              />
                            </Text>
                          </div>
                        </Flex>
                      </Box>
                    </Box>
                    <Box
                      flex={"0 0 calc(100% / 3)"}
                      className="table-cell"
                      pr={5}
                    >
                      <Box h={"100%"} className="relative">
                        <ProgressBarStatic isAsk />
                        <Flex
                          className="cell-text text-right progress_bar_text"
                          align={"center"}
                          justify={"end"}
                        >
                          <Text
                            fz={12}
                            styles={{
                              root: {
                                color: "light-dark(#000, #ffffff)",
                              },
                            }}
                          >
                            <NumberFormat
                              value={vol}
                              decimalPlaces={agg > 10e6 ? 2 : 6}
                            />
                          </Text>
                        </Flex>
                      </Box>
                    </Box>
                    <Box
                      flex={"0 0 calc(100% / 3)"}
                      className="table-cell"
                      pl={5}
                      pr={5}
                    >
                      <Box h={"100%"} className="relative">
                        <Box
                          h={"100%"}
                          className="progress_bar"
                          left={0}
                          top={0}
                          w={`${Math.random() * 100}%`}
                          pos={"absolute"}
                          style={{
                            background:
                              "light-dark(#feeaea, #35191d)",
                          }}
                        ></Box>
                        <Flex
                          className="cell-text text-left progress_bar_text"
                          align={"center"}
                          justify={"end"}
                        >
                          <Text
                            fz={12}
                            styles={{
                              root: {
                                color: "light-dark(#000, #ffffff)",
                              },
                            }}
                          >
                            {formatCurrency(agg)}
                          </Text>
                        </Flex>
                      </Box>
                    </Box>
                  </Flex>
                </HoverCard.Target>
                <HoverCard.Dropdown
                  styles={{
                    dropdown: {
                      background: "light-dark(#f3f5f7, #26282c)",
                    },
                  }}
                >
                  <Box className="space-y-5">
                    <Flex justify={"space-between"}>
                      <Text fz={12}>{t("Price")}</Text>
                      <Text
                        fz={12}
                        fw={"bold"}
                        styles={{
                          root: {
                            color: "light-dark(#121214, #fff)",
                          },
                        }}
                      >
                        {formatCurrency(price ?? 0)}
                      </Text>
                    </Flex>
                    <Flex justify={"space-between"}>
                      <Text fz={12}>{`${t(
                        "Total Volume",
                      )} (${base})`}</Text>
                      <Text
                        fz={12}
                        fw={"bold"}
                        styles={{
                          root: {
                            color: "light-dark(#121214, #fff)",
                          },
                        }}
                      >
                        {agg}
                      </Text>
                    </Flex>
                  </Box>
                </HoverCard.Dropdown>
              </HoverCard>
            ))}
        </div>
      </div>
      {display === "ASK & BID" && (
        <>
          {" "}
          <Space mt={10} />
          {pricePanel}
          <Space mt={10} />
        </>
      )}
      {/* BID */}
      <div className={`table-root ${status}`}>
        <div className="table-body">
          {display !== "BID ONLY" &&
            green.map(([price, vol, agg], idx) => (
              <HoverCard
                key={idx}
                width={230}
                openDelay={200}
                closeDelay={0}
                shadow="md"
                position="left"
                withinPortal
                withArrow
                arrowPosition="center"
                arrowSize={14}
              >
                <HoverCard.Target>
                  <Flex className={"table-row table-row-default"}>
                    <Box
                      flex={"0 0 calc(100% / 3)"}
                      className="table-cell"
                    >
                      <Box pl={5}>
                        <Flex align={"center"}>
                          <span className="cell-text long">
                            <Text fz={12} c={"#23b26b"}>
                              <NumberFormat
                                value={price}
                                decimalPlaces={2}
                              />
                            </Text>
                          </span>
                        </Flex>
                      </Box>
                    </Box>
                    <Box
                      flex={"0 0 calc(100% / 3)"}
                      className="table-cell"
                      pr={5}
                    >
                      <Box h={"100%"} className="relative">
                        <ProgressBarStatic />
                        <Flex
                          className="cell-text text-right progress_bar_text"
                          align={"center"}
                          justify={"end"}
                        >
                          <Text
                            fz={12}
                            styles={{
                              root: {
                                color: "light-dark(#121214, #fff)",
                              },
                            }}
                          >
                            <NumberFormat
                              value={vol}
                              decimalPlaces={agg > 10e6 ? 2 : 6}
                            />
                          </Text>
                        </Flex>
                      </Box>
                    </Box>
                    <Box
                      flex={"0 0 calc(100% / 3)"}
                      className="table-cell"
                      pl={5}
                      pr={5}
                    >
                      <Box h={"100%"} className="relative">
                        <Box
                          h={"100%"}
                          className="progress_bar"
                          left={0}
                          top={0}
                          w={`${Math.random() * 100}%`}
                          pos={"absolute"}
                          style={{
                            background:
                              "light-dark(#e7f6ed, #162a24)",
                          }}
                        ></Box>
                        <Flex
                          h={"24px"}
                          className="cell-text text-left progress_bar_text"
                          align={"center"}
                          justify={"end"}
                        >
                          <Text
                            fz={12}
                            styles={{
                              root: {
                                color: "light-dark(#121214, #fff)",
                              },
                            }}
                          >
                            {formatCurrency(agg ?? 0)}
                          </Text>
                        </Flex>
                      </Box>
                    </Box>
                  </Flex>
                </HoverCard.Target>
                <HoverCard.Dropdown
                  styles={{
                    dropdown: {
                      background: "light-dark(#f3f5f7, #26282c)",
                    },
                  }}
                >
                  <Box className="space-y-5">
                    <Flex justify={"space-between"}>
                      <Text fz={12}>{t("Price")}</Text>
                      <Text
                        fz={12}
                        fw={"bold"}
                        styles={{
                          root: {
                            color: "light-dark(#121214, #fff)",
                          },
                        }}
                      >
                        {formatCurrency(price ?? 0)}
                      </Text>
                    </Flex>
                    <Flex justify={"space-between"}>
                      <Text fz={12}>{`${t(
                        "Total Volume",
                      )} (${base})`}</Text>
                      <Text
                        fz={12}
                        fw={"bold"}
                        styles={{
                          root: {
                            color: "light-dark(#121214, #fff)",
                          },
                        }}
                      >
                        {agg}
                      </Text>
                    </Flex>
                    <Flex justify={"space-between"}>
                      <Text fz={12}>Total Qty (USDT)</Text>
                      <Text
                        fz={12}
                        fw={"bold"}
                        styles={{
                          root: {
                            color: "light-dark(#121214, #fff)",
                          },
                        }}
                      >
                        54.394K
                      </Text>
                    </Flex>
                  </Box>
                </HoverCard.Dropdown>
              </HoverCard>
            ))}
        </div>
      </div>
      {display === "ASK & BID" && (
        <>
          <Space mt={10} />
          <HoverCard
            openDelay={200}
            width={280}
            shadow="md"
            position="top"
            styles={{
              dropdown: {
                background: "light-dark(#f3f5f7, #26282c)",
              },
            }}
          >
            <HoverCard.Target>
              <Box px={10}>
                <Box pos={"relative"} className="cursor-pointer">
                  <Box
                    w={`${bidRate}%`}
                    h={20}
                    pos={"absolute"}
                    left={0}
                    top={"50%"}
                    style={{
                      transform: "translateY(-50%)",
                      clipPath:
                        "polygon(0 0, 100% 0, calc(100% - 5px) 100%, 0% 100%)",
                      background: "light-dark(#e7f6ed, #172b23)",
                    }}
                  />
                  <Box
                    w={`${askRate}%`}
                    h={20}
                    pos={"absolute"}
                    right={0}
                    top={"50%"}
                    style={{
                      transform: "translateY(-50%)",
                      clipPath:
                        "polygon(calc(0% + 5px) 0, 100% 0, 100% 100%, 0% 100%)",
                      background: "light-dark(#feeaea, #35191e)",
                    }}
                  />
                  <Flex
                    justify={"space-between"}
                    align={"center"}
                    pos={"relative"}
                    h={"100%"}
                    styles={{
                      root: {
                        zIndex: 1,
                      },
                    }}
                  >
                    <Flex align={"center"} gap={4} h={"100%"}>
                      <Flex
                        align={"center"}
                        justify={"center"}
                        fz={10}
                        fw={600}
                        bd={"solid 1px #23b26b"}
                        w={20}
                        h={20}
                        style={{
                          textAlign: "center",
                          borderRadius: "2px",
                        }}
                        c={"#23b26b"}
                      >
                        B
                      </Flex>
                      <Text
                        c={"#23b26b"}
                        fz={12}
                        fw={500}
                      >{`${bidRate}%`}</Text>
                    </Flex>
                    <Flex align={"center"} gap={4} h={"100%"}>
                      <Text
                        c={"#f0444b"}
                        fz={12}
                        fw={500}
                      >{`${askRate}%`}</Text>
                      <Flex
                        align={"center"}
                        justify={"center"}
                        fz={10}
                        fw={600}
                        bd={"solid 1px #f0444b"}
                        w={20}
                        h={20}
                        style={{
                          textAlign: "center",
                          borderRadius: "2px",
                        }}
                        c={"#f0444b"}
                      >
                        S
                      </Flex>
                    </Flex>
                  </Flex>
                </Box>
              </Box>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Text size="sm">
                {t(
                  "Bid-Ask Ratio for the Top %s Levels within the %s Order Book",
                  ORDER_BOOK_LIMIT,
                  symbol,
                )}
              </Text>
            </HoverCard.Dropdown>
          </HoverCard>
        </>
      )}
    </>
  );
}

const transitions = [100, 300, 600, 400, 1000, 1200, 2000];
function ProgressBarStatic({ isAsk }: { isAsk?: boolean }) {
  return (
    <>
      <Box
        h={"100%"}
        aria-level={transitions[Math.floor(Math.random() * 7)]}
        className={`progress_bar progress_bar--static ${
          isAsk ? "isDown" : "isUp"
        }`}
        right={0}
        top={0}
        w={`${100}%`}
        pos={"absolute"}
      ></Box>
    </>
  );
}
