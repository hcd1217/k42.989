import orderAllLight from "@/assets/images/icon/orderAll-light.svg";
import orderAll from "@/assets/images/icon/orderAll.svg";
import orderBuyLight from "@/assets/images/icon/orderBuy-light.svg";
import orderBuy from "@/assets/images/icon/orderBuy.svg";
import orderSellLight from "@/assets/images/icon/orderSell-light.svg";
import orderSell from "@/assets/images/icon/orderSell.svg";

import useSPETranslation from "@/hooks/useSPETranslation";
import {
  OrderBookTable,
  type OrderBookType,
} from "@/ui/OrderBook/OrderBookTable";
import { OrderHorizontalOrderBookTrade } from "@/ui/OrderBook/OrderHorizontalOrderBookTrade";
import AppTabs from "@/ui/Tabs";
import {
  Box,
  Flex,
  Image,
  SegmentedControl,
  Select,
} from "@mantine/core";
import { IconCaretDownFilled } from "@tabler/icons-react";
import { useState } from "react";
import { GridRecentTrade } from ".";

type GridType =
  | "orderAll"
  | "orderHorizontal"
  | "orderBuy"
  | "orderSell";

const displayMap: Record<GridType, OrderBookType> = {
  orderAll: "ASK & BID",
  orderHorizontal: "ASK & BID",
  orderBuy: "ASK ONLY",
  orderSell: "BID ONLY",
};
export function OrderBook(props: {
  isSpot?: boolean;
  symbol: string;
  base: string;
  quote: string;
}) {
  const t = useSPETranslation();
  return (
    <>
      <AppTabs
        variant="WithMediumNoBorder"
        className="noBg"
        defaultValue={"orderBooks"}
        showPanel
        tabs={[
          {
            data: {
              label: t("Order Book"),
              value: "orderBooks",
            },
            tabsPanelProps: {
              children: <GridOrderBook {...props} />,
              value: "orderBooks",
            },
          },
          {
            data: {
              label: t("Recent Trades"),
              value: "trades",
            },
            tabsPanelProps: {
              children: <GridRecentTrade />,
              value: "trades",
            },
          },
        ]}
      />
    </>
  );
}

function GridOrderBook(props: {
  isSpot?: boolean;
  symbol: string;
  base: string;
  quote: string;
}) {
  const [gridType, setGridType] = useState<GridType>("orderAll");
  const w = 14;
  return (
    <>
      <Flex align={"center"} justify={"space-between"} px={10} py={5}>
        <Box>
          <SegmentedControl
            withItemsBorders={false}
            size="sm"
            onChange={(v) => setGridType(v as GridType)}
            value={gridType}
            styles={{
              root: {
                background: "none",
              },
            }}
            data={[
              {
                value: "orderAll",
                label: (
                  <Box w={w}>
                    <Image lightHidden src={orderAll} />
                    <Image darkHidden src={orderAllLight} />
                  </Box>
                ),
              },
              // {
              //   value: "orderHorizontal",
              //   label: (
              //     <Box w={w}>
              //       <Image lightHidden src={orderHorizontal} />
              //       <Image darkHidden src={orderHorizontalLight} />
              //     </Box>
              //   ),
              // },
              {
                value: "orderBuy",
                label: (
                  <Box w={w}>
                    <Image lightHidden src={orderBuy} />
                    <Image darkHidden src={orderBuyLight} />
                  </Box>
                ),
              },
              {
                value: "orderSell",
                label: (
                  <Box w={w}>
                    <Image lightHidden src={orderSell} />
                    <Image darkHidden src={orderSellLight} />
                  </Box>
                ),
              },
            ]}
          />
        </Box>
        <Box hidden>
          <Select
            w={80}
            data={["0.1", "0.2", "0.4", "1", "2", "5", "10"]}
            defaultValue="0.1"
            withCheckIcon={false}
            rightSection={<IconCaretDownFilled size={14} />}
            allowDeselect={false}
            rightSectionWidth={20}
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
                textAlign: "center",
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                fontWeight: "bold",
                color: "light-dark(black, white)",
                background: "light-dark(#f3f5f7, #26282c)",
                minHeight: "unset",
                height: "24px",
              },
              option: {
                fontSize: "12px",
                textAlign: "center",
                justifyContent: "center",
                fontWeight: "bold",
              },
            }}
          />
        </Box>
      </Flex>
      {gridType === "orderHorizontal" ? (
        <OrderHorizontalOrderBookTrade />
      ) : (
        <OrderBookTable display={displayMap[gridType]} {...props} />
      )}
    </>
  );
}
