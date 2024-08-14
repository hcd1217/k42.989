import BN from "@/common/big-number";
import useSPETranslation from "@/hooks/useSPETranslation";
import logger from "@/services/logger";
import tradeStore from "@/store/trade";
import { GridTradeProps } from "@/types";
import NumberFormat from "@/ui/NumberFormat";
import { AppPopover } from "@/ui/Popover/AppPopover";
import AppText from "@/ui/Text/AppText";
import { ONE_HOUR, ONE_MINUTE } from "@/utils";
import { isBlur } from "@/utils/utility";
import { Box, Divider, Flex, HoverCard } from "@mantine/core";
import { useHover, useInterval } from "@mantine/hooks";
import { IconDots } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { MenuToken } from "./MenuToken";

export function TopBar({
  isFuture,
  isSpot,
  symbol,
  base,
  quote,
}: GridTradeProps) {
  const { hovered, ref } = useHover();
  const t = useSPETranslation();
  const { marketInformation } = tradeStore();
  const info = useMemo(() => {
    const data = marketInformation[symbol];
    if (!data) {
      return {
        change24h: "",
        color: "",
        percent: "",
        sb: "",
      };
    }

    const { color, sb } = _colorAndSb(Number(data.percent)) || "0";
    return {
      data,
      color,
      sb,
    };
  }, [marketInformation, symbol]);
  return (
    <>
      <Flex
        className="bg-trade"
        align={"center"}
        gap={{
          xs: 10,
          lg: 20,
        }}
        p={10}
      >
        <MenuToken {...{ isFuture, isSpot, symbol, base, quote }} />
        <Divider orientation="vertical" />
        <div>
          <AppText instancetype="withPriceLong" c={"green"}>
            <NumberFormat
              value={info.data?.lastPrice}
              decimalPlaces={2}
            />
          </AppText>
          <AppPopover
            withArrow={false}
            position="bottom-start"
            target={(props) => ({
              children: (
                <AppText
                  // eslint-disable-next-line react/prop-types
                  onMouseLeave={props.close}
                  style={{ cursor: "help" }}
                  // eslint-disable-next-line react/prop-types
                  onMouseEnter={props.open}
                  instancetype="WithTextSubtitle"
                  fw={"bold"}
                >
                  <NumberFormat
                    value={info.data?.markPrice}
                    decimalPlaces={2}
                  />
                </AppText>
              ),
            })}
            dropdown={() => ({
              children: (
                <div>
                  <AppText instancetype="WithTextTooltip">
                    {t(
                      "Mark price is derived by index price and funding rate, and reflects the fair market price. Liquidation is triggered by mark price.",
                    )}
                  </AppText>
                  <AppText
                    component="a"
                    href="#"
                    instancetype="WithTextTooltip"
                    c={"primary"}
                  >
                    {t("Click here for details")}
                  </AppText>
                </div>
              ),
            })}
          ></AppPopover>
        </div>
        {isFuture && (
          <Box visibleFrom="sm">
            <AppText instancetype="withPriceTextStatus">
              {t("Index Price")}
            </AppText>
            <AppText instancetype="WithTextSubtitle" fw={"bold"}>
              <NumberFormat
                value={info.data?.indexPrice}
                decimalPlaces={2}
              />
            </AppText>
          </Box>
        )}
        <Box visibleFrom="xl">
          <Flex align={"center"} gap={20}>
            <div>
              <AppText instancetype="withPriceTextStatus">
                {t("24H Change")}(%)
              </AppText>
              <AppText
                instancetype="WithTextSubtitle"
                fw={"bold"}
                c={info.color}
              >
                {/* +124.08 <span>(+3.61%)</span> */}
                {info.sb}
                <NumberFormat
                  value={info.data?.change}
                  decimalPlaces={2}
                />{" "}
                <span>
                  ({info.sb}
                  <NumberFormat
                    value={info.data?.percent}
                    decimalPlaces={2}
                  />
                  %)
                </span>
              </AppText>
            </div>
            <div>
              <AppText instancetype="withPriceTextStatus">
                {t("24H High")}
              </AppText>
              <AppText instancetype="WithTextSubtitle" fw={"bold"}>
                <NumberFormat
                  value={info.data?.high}
                  decimalPlaces={2}
                />
              </AppText>
            </div>
            <div>
              <AppText instancetype="withPriceTextStatus">
                {t("24H Low")}
              </AppText>
              <AppText instancetype="WithTextSubtitle" fw={"bold"}>
                <NumberFormat
                  value={info.data?.low}
                  decimalPlaces={2}
                />
              </AppText>
            </div>
            <div ref={ref}>
              {!hovered ? (
                <div>
                  <AppText instancetype="withPriceTextStatus">
                    {t("24H Turnover")}({quote})
                  </AppText>
                  <AppText
                    instancetype="WithTextSubtitle"
                    fw={"bold"}
                  >
                    {/* <NumberFormat
                      value={info.data?.turnOver}
                      decimalPlaces={2}
                    /> */}
                    {t("N/A")}
                  </AppText>
                </div>
              ) : (
                <div>
                  <AppText instancetype="withPriceTextStatus">
                    {t("24H Volume")}
                  </AppText>
                  <AppText
                    instancetype="WithTextSubtitle"
                    fw={"bold"}
                  >
                    {t("N/A")}
                  </AppText>
                </div>
              )}
            </div>
            {isFuture && (
              <div>
                <AppText instancetype="withPriceTextStatus">
                  {t("Open Interest")}({base})
                </AppText>
                <AppText instancetype="WithTextSubtitle" fw={"bold"}>
                  {/* <NumberFormat
                  value={info.data?.openInterest}
                  decimalPlaces={2}
                /> */}
                  {t("N/A")}
                </AppText>
              </div>
            )}
          </Flex>
        </Box>
        {isFuture && (
          <Box visibleFrom="sm">
            <AppPopover
              withArrow={false}
              position="bottom-start"
              target={(props) => ({
                children: (
                  <div
                    // eslint-disable-next-line react/prop-types
                    onMouseLeave={props.close}
                    style={{ cursor: "help" }}
                    // eslint-disable-next-line react/prop-types
                    onMouseEnter={props.open}
                  >
                    <AppText instancetype="withPriceTextStatus">
                      <span>{t("Funding Rate")}</span>/{" "}
                      {t("Countdown")}
                    </AppText>
                    <Flex gap={5}>
                      <AppText
                        instancetype="WithTextSubtitle"
                        fw={"bold"}
                        c={"primary"}
                      >
                        <NumberFormat
                          value={BN.mul(
                            info.data?.fundingRate || 0,
                            100,
                          )}
                          decimalPlaces={5}
                        />
                        %
                      </AppText>
                      <AppText
                        instancetype="WithTextSubtitle"
                        fw={"bold"}
                      >
                        /
                      </AppText>
                      <AppText
                        instancetype="WithTextSubtitle"
                        fw={"bold"}
                      >
                        {info.data?.nextFundingTime ? (
                          <CountDown
                            nextFundingTime={
                              info.data?.nextFundingTime
                            }
                          />
                        ) : (
                          "N/A"
                        )}
                      </AppText>
                    </Flex>
                  </div>
                ),
              })}
              dropdown={() => ({
                children: (
                  <div>
                    <AppText instancetype="WithTextTooltip">
                      <p>
                        {t(
                          "Funding fees will be exchanged between long and short position holders every 8 hours. Please note that the funding rate will fluctuate in real time every 8 hours. If the funding rate is positive upon settlement, long position holders will pay short position holders. If the funding rate is negative, short position holders will pay long position holders.",
                        )}
                      </p>

                      <p>
                        {t(
                          "Your position value at the timestamp when funding is settled will be used to derive your funding fees.",
                        )}
                      </p>

                      <p>
                        {t(
                          "Funding Fees = Position Value * Funding Rate",
                        )}
                      </p>
                    </AppText>
                  </div>
                ),
              })}
            ></AppPopover>
          </Box>
        )}
        <Box hiddenFrom="xl">
          <HoverCard openDelay={200}>
            <HoverCard.Target>
              <Box display={"flex"}>
                <IconDots />
              </Box>
            </HoverCard.Target>
            <HoverCard.Dropdown
              styles={{
                dropdown: {
                  maxWidth: "calc(100% - 20px)",
                },
              }}
            >
              <Flex align={"center"} gap={20} wrap={"wrap"}>
                <Box hiddenFrom="sm">
                  <AppText instancetype="withPriceTextStatus">
                    {t("Index Price")}(%)
                  </AppText>
                  <AppText
                    instancetype="WithTextSubtitle"
                    fw={"bold"}
                  >
                    <NumberFormat
                      value={info.data?.indexPrice}
                      decimalPlaces={2}
                    />
                  </AppText>
                </Box>
                <div>
                  <AppText instancetype="withPriceTextStatus">
                    {t("24H Change")}(%)
                  </AppText>
                  <AppText
                    instancetype="WithTextSubtitle"
                    fw={"bold"}
                  >
                    +124.08 <span>(+3.61%)</span>
                  </AppText>
                </div>
                <div>
                  <AppText instancetype="withPriceTextStatus">
                    {t("24H High")}
                  </AppText>
                  <AppText
                    instancetype="WithTextSubtitle"
                    fw={"bold"}
                  >
                    <NumberFormat
                      value={info.data?.high}
                      decimalPlaces={2}
                    />
                  </AppText>
                </div>
                <div>
                  <AppText instancetype="withPriceTextStatus">
                    {t("24H Low")}
                  </AppText>
                  <AppText
                    instancetype="WithTextSubtitle"
                    fw={"bold"}
                  >
                    <NumberFormat
                      value={info.data?.low}
                      decimalPlaces={2}
                    />
                  </AppText>
                </div>
                <div ref={ref}>
                  {!hovered ? (
                    <div>
                      <AppText instancetype="withPriceTextStatus">
                        24H Turnover(USDT)
                      </AppText>
                      <AppText
                        instancetype="WithTextSubtitle"
                        fw={"bold"}
                      >
                        <NumberFormat
                          value={info.data?.turnOver}
                          decimalPlaces={2}
                        />
                      </AppText>
                    </div>
                  ) : (
                    <div>
                      <AppText instancetype="withPriceTextStatus">
                        24H Volume
                      </AppText>
                      <AppText
                        instancetype="WithTextSubtitle"
                        fw={"bold"}
                      >
                        <NumberFormat
                          value={info.data?.volume}
                          decimalPlaces={2}
                        />
                      </AppText>
                    </div>
                  )}
                </div>
                <div>
                  <AppText instancetype="withPriceTextStatus">
                    Open Interest(BTC)
                  </AppText>
                  <AppText
                    instancetype="WithTextSubtitle"
                    fw={"bold"}
                  >
                    <NumberFormat
                      value={info.data?.openInterest}
                      decimalPlaces={2}
                    />
                  </AppText>
                </div>
                <Box hiddenFrom="sm">
                  <AppPopover
                    withArrow={false}
                    position="bottom-start"
                    target={(props) => ({
                      children: (
                        <div
                          // eslint-disable-next-line react/prop-types
                          onMouseLeave={props.close}
                          style={{ cursor: "help" }}
                          // eslint-disable-next-line react/prop-types
                          onMouseEnter={props.open}
                        >
                          <AppText instancetype="withPriceTextStatus">
                            <span>{t("Funding Rate")}</span>/{" "}
                            {t("Countdown")}
                          </AppText>
                          <Flex gap={5}>
                            <AppText
                              instancetype="WithTextSubtitle"
                              fw={"bold"}
                              c={"primary"}
                            >
                              <NumberFormat
                                value={BN.mul(
                                  info.data?.fundingRate || 0,
                                  100,
                                )}
                                decimalPlaces={5}
                              />
                              %
                            </AppText>
                            <AppText
                              instancetype="WithTextSubtitle"
                              fw={"bold"}
                            >
                              /
                            </AppText>
                            <AppText
                              instancetype="WithTextSubtitle"
                              fw={"bold"}
                            >
                              {info.data?.nextFundingTime ? (
                                <CountDown
                                  nextFundingTime={
                                    info.data?.nextFundingTime
                                  }
                                />
                              ) : (
                                "N/A"
                              )}
                            </AppText>
                          </Flex>
                        </div>
                      ),
                    })}
                    dropdown={() => ({
                      children: (
                        <div>
                          <AppText instancetype="WithTextTooltip">
                            <p>
                              {t(
                                "Funding fees will be exchanged between long and short position holders every 8 hours. Please note that the funding rate will fluctuate in real time every 8 hours. If the funding rate is positive upon settlement, long position holders will pay short position holders. If the funding rate is negative, short position holders will pay long position holders.",
                              )}
                            </p>

                            <p>
                              {t(
                                "Your position value at the timestamp when funding is settled will be used to derive your funding fees.",
                              )}
                            </p>

                            <p>
                              {t(
                                "Funding Fees = Position Value * Funding Rate",
                              )}
                            </p>
                          </AppText>
                        </div>
                      ),
                    })}
                  ></AppPopover>
                </Box>
              </Flex>
            </HoverCard.Dropdown>
          </HoverCard>
        </Box>
      </Flex>
    </>
  );
}
function _remain(nextFundingTime: number) {
  let remain = nextFundingTime - Date.now();
  if (remain <= 0) {
    return "00:00:00";
  }
  const h = Math.floor(remain / ONE_HOUR);
  remain = remain - h * ONE_HOUR;
  const m = Math.floor(remain / ONE_MINUTE);
  remain = remain - m * ONE_MINUTE;
  const s = Math.floor(remain / 1000);
  return `${_padding(h)}:${_padding(m)}:${_padding(s)}`;
}

function _padding(num: number) {
  return num.toString().padStart(2, "0");
}

function CountDown({ nextFundingTime }: { nextFundingTime: number }) {
  const [counter, setCounter] = useState(0);

  const interval = useInterval(() => {
    if (isBlur()) {
      logger.trace("Skip counter");
      return;
    }
    logger.trace("increase counter...");
    setCounter((prev) => prev + 1);
  }, 1e3);

  useEffect(() => {
    interval.start();
    return interval.stop;
  }, [interval]);

  return <span key={counter}>{_remain(nextFundingTime)}</span>;
}

function _colorAndSb(p: number) {
  if (p > 0) {
    return { color: "#22ae6a", sb: "+" };
  }
  if (p < 0) {
    return { color: "#ea4549", sb: "-" };
  }
  return { color: "#6627e7", sb: "" };
}
