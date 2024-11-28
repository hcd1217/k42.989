import AppButton from "@/ui/Button/AppButton";
import { AppPopover } from "@/ui/Popover/AppPopover";
import AppText from "@/ui/Text/AppText";
import { fmtDate } from "@/utils/utility";
import { Box, Flex, TableData } from "@mantine/core";
import { IconEdit, IconPlus } from "@tabler/icons-react";

type TradeHistoryBy =
  | "positions"
  | "PnL"
  | "currentOrders"
  | "orderHistory"
  | "tradeHistory";

type TableDataFunction = (_type?: unknown) => TableData;

type TableHistory = Partial<{
  [k in TradeHistoryBy]: TableDataFunction;
}>;

const row = {
  icon: "https://www.bybit.com/bycsi-root/fop/9e97acce-0ffd-4148-8248-1720f6758fa0.svg",
  base: "BTC",
  quote: "USDT",
  qty: -960.551 + Math.floor(Math.random() * 20),
  actualQty: -960.551 + Math.floor(Math.random() * 20),
  entryPrice: 67534.1 + Math.floor(Math.random() * 20),
  exitPrice: 67534.1 + Math.floor(Math.random() * 20),
  orderPrice: 67534.1 + Math.floor(Math.random() * 20),
  triggerPriceTP: 67534.1 + Math.floor(Math.random() * 20),
  triggerPriceSL: 67534.1 + Math.floor(Math.random() * 20),
  triggerMMR: Math.floor(Math.random() * 100),
  liqPrice: [67534.1, null][Math.floor(Math.random() * 2)],
  triggerPrice: 67534.1 + Math.floor(Math.random() * 20),
  Filled: 67534.1 + Math.floor(Math.random() * 20),
  FilledPrice: 67534.1 + Math.floor(Math.random() * 20),
  Total: 67534.1 + Math.floor(Math.random() * 20),
  price: "0.06008 (-0.05958)",

  value: 67534.1 + Math.floor(Math.random() * 20),
  filledTotal: 67534.1 + Math.floor(Math.random() * 20),
  tp: [67534.1 + 100, null][Math.floor(Math.random() * 2)],
  sl: [67534.1 - 100, null][Math.floor(Math.random() * 2)],
  tradeType: ["Close Short", "Close Long", "Open Long", "Open Short"][
    Math.floor(Math.random() * 4)
  ],
  orderSide: ["Limit", "Market"][Math.floor(Math.random() * 2)],
  filledType: ["Trade", "Withdraw"][Math.floor(Math.random() * 2)],
  reduceOnly: [true, false][Math.floor(Math.random() * 2)],
  status: ["Active", "Closed", "Filled", "Canceled"][
    Math.floor(Math.random() * 4)
  ],
  No: "c8891a7b",
  orderTime: Date.now() + Math.floor(Math.random() * 100),
  tradeTime: Date.now() + Math.floor(Math.random() * 100),
  transactionTime: Date.now() + Math.floor(Math.random() * 100),
  isBuy: [true, false][Math.floor(Math.random() * 2)],
  NoTP: "4ff674f5",
  NoSL: "e777fc79",
  transactionID: ["834bc268", "0fd3accd"][
    Math.floor(Math.random() * 2)
  ],

  markPrice: 67534.1,
  IM: `6,226.2725 USDT
                        ~6,226.27 USD`,
  MM: `1,275.2084 USDT
                        ~1,275.20 USD`,
  unRealizedPnL: `1,786.6248 USDT
                        (28.69%)
                        ~1,786.62 USD
                        `,
  realizedPnL: `2,417.9062 USDT
                        ~2,417.90 USD`,
  TrailingStop: [
    `Trigger: 0.06250
                        ReTrackmen: 0.00005`,
    null,
  ][Math.floor(Math.random() * 2)],
  mmr: ["Trigger: ≥82.28%", null][Math.floor(Math.random() * 2)],
  exitType: ["Trade", "Withdraw"][Math.floor(Math.random() * 2)],
  closedPl: [67534.1 - 100, 67534.1 + 100][
    Math.floor(Math.random() * 2)
  ],
};

export const dataHistories: TableHistory = {
  positions: () => {
    const _items = [
      [
        "Contracts",
        "Contract name will always be displayed when you’re scrolling.",
      ],
      [
        "Qty",
        "A positive value of quantity indicates a long position, while a negative value indicates a short position",
      ],
      ["Value", "Notional value of the current position"],
      [
        "Entry Price",
        "The weighted average entry price of your positions",
      ],
      ["Mark Price"],
      [
        "Liq. Price",
        `The est. liquidation price for a USDT Perpetual position in your Unified Trading Account is affected by your average entry price, unrealized P&L, maintenance margin, and the available balance in your account.
                    Having multiple positions simultaneously will affect the est. liquidation price for each position. Please note that the est. liquidation price is for reference only.
                    Do note that liquidation is triggered when account maintenance margin rate reaches 100%.`,
      ],
      ["IM", "The amount of margin required to open your position"],
      [
        "MM",
        "The minimum amount of margin required for holding your positions.",
      ],
      [
        "Unrealized P&L (%)",
        "Unrealized profit loss and return on equity of this position",
      ],
      [
        "Realized P&L",
        "You can set or cancel take profit/stop loss and trailing stop orders here. Once placed, the order can be viewed under the Positions Tab.",
      ],
      [
        "TP/SL",
        "You can set or cancel take profit/stop loss and trailing stop orders here. Once placed, the order can be viewed under the Positions Tab.",
      ],
      [
        "Trailing Stop",
        "A trailing stop will allow a stop order to follow the last traded price based on a pre-set distance and direction, and will automatically move to lock in the profit or stop loss.",
      ],
      [
        "MMR Close",
        "When the account's Maintenance Margin Rate (MMR) reaches the preset Trigger MMR, a market close order for the entire position will be triggered.",
      ],
      [
        "Reverse Position",
        "The Quick Reverse Function lets you respond to trend changes in the market quickly with a click. With this feature, you can close open positions for the contract and then immediately open a new position in the opposite direction in the same action.",
      ],
      ["Close By"],
    ];
    const rows = [...Array(20)]
      .map(() => ({ ...row }))
      .map(
        (
          {
            base,
            quote,
            entryPrice,
            qty,
            isBuy,
            value,
            markPrice,
            liqPrice,
            IM,
            MM,
            unRealizedPnL,
            realizedPnL,
            tp,
            sl,
            TrailingStop,
            mmr,
          },
          idx,
        ) => [
          <Flex key={`${idx}.1`} align={"center"} gap={8}>
            <Box bg={isBuy ? "green" : "red"} w={"2px"} h={30} />
            <div>
              <AppText instancetype="WithCellToken" fz={12}>
                {base}
                {quote}
              </AppText>
              <AppText
                c={isBuy ? "green" : "red"}
                fz={12}
                fw={"bold"}
                style={{ whiteSpace: "nowrap" }}
              >
                Cross 10.00x
              </AppText>
            </div>
          </Flex>,
          <AppText
            key={`${idx}.2`}
            instancetype="WithCellToken"
            fz={12}
            c={isBuy ? "green" : "red"}
          >
            {qty}
          </AppText>,
          <AppText
            key={`${idx}.3`}
            instancetype="WithCellToken"
            fz={12}
          >
            {value}
          </AppText>,
          <AppText
            key={`${idx}.4`}
            instancetype="WithCellToken"
            fz={12}
          >
            {entryPrice}
          </AppText>,
          <AppText
            key={`${idx}.5`}
            instancetype="WithCellToken"
            fz={12}
          >
            {markPrice}
          </AppText>,
          <AppText
            key={`${idx}.6`}
            instancetype="WithCellToken"
            fz={12}
            c={"primary"}
          >
            {liqPrice ?? "--"}
          </AppText>,
          <Box key={`${idx}.7`} w={120}>
            <AppText instancetype="WithCellToken" fz={12}>
              {IM}
            </AppText>
          </Box>,
          <Box key={`${idx}.8`} w={120}>
            <AppText instancetype="WithCellToken" fz={12}>
              {MM}
            </AppText>
          </Box>,
          <AppPopover
            key={`${idx}.9`}
            withArrow={false}
            target={(props) => ({
              children: (
                <AppText
                  onMouseEnter={props.open}
                  onMouseLeave={props.close}
                  instancetype="WithCellToken"
                  fz={12}
                  c={isBuy ? "green" : "red"}
                >
                  {unRealizedPnL}
                </AppText>
              ),
            })}
            dropdown={() => ({
              children: (
                <AppText instancetype="WithTextTooltip">
                  By default, the unrealized profit and loss are
                  calculated based on the last traded price. When you
                  move your cursor here, the unrealized profit and
                  loss shown are calculated based on the mark price
                </AppText>
              ),
            })}
          ></AppPopover>,
          <Box w={120} key={`${idx}.10`}>
            <AppText
              instancetype="WithCellToken"
              fz={12}
              c={isBuy ? "green" : "red"}
            >
              {realizedPnL}
            </AppText>
          </Box>,
          <Flex gap={10} align={"center"} key={`${idx}.11`}>
            {tp && sl ? (
              <>
                <Flex align={"center"} direction={"column"} gap={0}>
                  <AppText
                    c={"green"}
                    instancetype="WithCellToken"
                    fz={12}
                    fw={"bold"}
                  >
                    {tp}
                  </AppText>
                  <Flex align={"center"} gap={0}>
                    <AppText
                      instancetype="WithCellToken"
                      fz={12}
                      fw={"bold"}
                    >
                      /
                    </AppText>
                    <AppText
                      c={"red"}
                      instancetype="WithCellToken"
                      fz={12}
                      fw={"bold"}
                    >
                      {sl}
                    </AppText>
                  </Flex>
                </Flex>
                <AppButton
                  variant="outline"
                  color="gray"
                  size="compact-xs"
                >
                  <IconEdit size={10} />
                </AppButton>
              </>
            ) : (
              <AppButton
                styles={{
                  root: {
                    background: "light-dark(#e9edf3, #414347)",
                    color: "light-dark(black, white)",
                  },
                }}
                size="compact-xs"
                fz={12}
              >
                <IconPlus size={16} />
                Add
              </AppButton>
            )}
          </Flex>,
          <Flex w={180} align={"center"} gap={5} key={`${idx}.12`}>
            {TrailingStop ? (
              <>
                <AppText instancetype="WithCellToken" fz={12}>
                  {TrailingStop}
                </AppText>
                <Box>
                  <AppButton
                    variant="outline"
                    color="gray"
                    size="compact-xs"
                  >
                    <IconEdit size={10} />
                  </AppButton>
                </Box>
              </>
            ) : (
              <AppButton
                styles={{
                  root: {
                    background: "light-dark(#e9edf3, #414347)",
                    color: "light-dark(black, white)",
                  },
                }}
                size="compact-xs"
                fz={12}
              >
                <IconPlus size={16} />
                Add
              </AppButton>
            )}
          </Flex>,
          <Flex w={170} align={"center"} gap={10} key={`${idx}.13`}>
            {mmr ? (
              <>
                <AppText instancetype="WithCellToken" fz={12}>
                  {mmr}
                </AppText>
                <Box>
                  <AppButton
                    variant="outline"
                    color="gray"
                    size="compact-xs"
                  >
                    <IconEdit size={10} />
                  </AppButton>
                </Box>
              </>
            ) : (
              <AppButton
                styles={{
                  root: {
                    background: "light-dark(#e9edf3, #414347)",
                    color: "light-dark(black, white)",
                  },
                }}
                size="compact-xs"
                fz={12}
              >
                <IconPlus size={16} />
                Add
              </AppButton>
            )}
          </Flex>,
          <AppText
            instancetype="WithCellToken"
            fz={12}
            key={`${idx}.14`}
          >
            <AppButton
              styles={{
                root: {
                  background: "light-dark(#e9edf3, #414347)",
                  color: "light-dark(black, white)",
                },
              }}
              size="compact-xs"
              fz={12}
            >
              Reverse
            </AppButton>
          </AppText>,
          <Flex key={`${idx}.15`} gap={10}>
            <AppButton
              size="compact-xs"
              fz={12}
              styles={{
                root: {
                  background: "light-dark(#e9edf3, #414347)",
                  color: "light-dark(black, white)",
                },
              }}
            >
              Limit
            </AppButton>
            <AppButton
              size="compact-xs"
              fz={12}
              styles={{
                root: {
                  background: "light-dark(#e9edf3, #414347)",
                  color: "light-dark(black, white)",
                },
              }}
            >
              Market
            </AppButton>
          </Flex>,
        ],
      );
    return {
      head: _items.map(([text, tooltip], i) => {
        return (
          <div key={i}>
            {tooltip ? (
              <AppPopover
                withArrow={false}
                target={(props) => ({
                  children: (
                    <AppText
                      className="cursor-pointer"
                      fz={12}
                      c={"#71757a"}
                      onMouseEnter={props.open}
                      onMouseLeave={props.close}
                      style={{
                        borderBottom:
                          "solid 1px light-dark(#eaecee, #595d61)",
                        whiteSpace: "nowrap",
                        width: "fit-content",
                      }}
                    >
                      {text}
                    </AppText>
                  ),
                })}
                dropdown={() => ({
                  children: (
                    <AppText instancetype="WithTextTooltip">
                      {tooltip}
                    </AppText>
                  ),
                })}
              ></AppPopover>
            ) : (
              <AppText
                className="cursor-pointer"
                fz={12}
                c={"#71757a"}
                style={{
                  borderBottom:
                    "solid 1px light-dark(#eaecee, #595d61)",
                  whiteSpace: "nowrap",
                  width: "fit-content",
                }}
              >
                {text}
              </AppText>
            )}
          </div>
        );
      }),
      body: rows,
    };
  },
  PnL: () => {
    const _items = [
      ["Contracts"],
      ["Qty"],
      ["Entry Price"],
      ["Exit Price"],
      ["Trade Type"],
      ["Closed P&L"],
      ["Exit Type"],
      ["Trade Time"],
    ];
    const rows = [...Array(20)]
      .map(() => ({
        ...row,
      }))
      .map(
        (
          {
            base,
            quote,
            entryPrice,
            qty,
            isBuy,
            exitPrice,
            exitType,
            tradeTime,
            tradeType,
            closedPl,
          },
          idx,
        ) => [
          <Flex key={`${idx}.1`} align={"center"} gap={8}>
            <Box bg={isBuy ? "green" : "red"} w={"2px"} h={30} />
            <div>
              <AppText instancetype="WithCellToken" fz={12}>
                {base}
                {quote}
              </AppText>
            </div>
          </Flex>,
          <AppText
            key={`${idx}.2`}
            instancetype="WithCellToken"
            fz={12}
            c={isBuy ? "green" : "red"}
          >
            {qty}
          </AppText>,

          <AppText
            key={`${idx}.4`}
            instancetype="WithCellToken"
            fz={12}
          >
            {entryPrice}
          </AppText>,
          <AppText
            key={`${idx}.5`}
            instancetype="WithCellToken"
            fz={12}
          >
            {exitPrice}
          </AppText>,
          <AppText
            key={`${idx}.3`}
            instancetype="WithCellToken"
            fz={12}
            c={"green"}
          >
            {tradeType}
          </AppText>,
          <AppText
            key={`${idx}.6`}
            instancetype="WithCellToken"
            fz={12}
          >
            {closedPl ?? "--"}
          </AppText>,
          <Box key={`${idx}.7`} w={120}>
            <AppText instancetype="WithCellToken" fz={12}>
              {exitType}
            </AppText>
          </Box>,
          <Box key={`${idx}.8`} miw={130}>
            <AppText instancetype="WithCellToken" fz={12}>
              {fmtDate(tradeTime)}
            </AppText>
          </Box>,
        ],
      );
    return {
      head: _items.map(([text, tooltip], i) => {
        return (
          <div key={i}>
            {tooltip ? (
              <AppPopover
                withArrow={false}
                target={(props) => ({
                  children: (
                    <AppText
                      className="cursor-pointer"
                      fz={12}
                      c={"#71757a"}
                      onMouseEnter={props.open}
                      onMouseLeave={props.close}
                      style={{
                        whiteSpace: "nowrap",
                        width: "fit-content",
                      }}
                    >
                      {text}
                    </AppText>
                  ),
                })}
                dropdown={() => ({
                  children: (
                    <AppText instancetype="WithTextTooltip">
                      {tooltip}
                    </AppText>
                  ),
                })}
              ></AppPopover>
            ) : (
              <AppText
                className="cursor-pointer"
                fz={12}
                c={"#71757a"}
                style={{
                  whiteSpace: "nowrap",
                  width: "fit-content",
                }}
              >
                {text}
              </AppText>
            )}
          </div>
        );
      }),
      body: rows,
    };
  },
  currentOrders: (_type = "Active") => {
    const data = {
      Active: {
        items: [
          ["Contracts"],
          ["Qty"],
          ["Order Price"],
          ["Filled / Total"],
          ["TP / SL"],
          ["Trade Type"],
          ["Order Type"],
          ["Reduce-Only"],
          ["Status"],
          ["Order No."],
          ["Order Time"],
          ["Actions"],
        ],
        rows: [...Array(20)]
          .map(() => ({ ...row }))
          .map(
            (
              {
                base,
                quote,
                qty,
                isBuy,
                tradeType,
                orderTime,
                orderSide,
                orderPrice,
                tp,
                sl,
                reduceOnly,
                status,
                ...props
              },
              idx,
            ) => [
              <Flex key={`${idx}.1`} align={"center"} gap={8}>
                <Box bg={isBuy ? "green" : "red"} w={"2px"} h={30} />
                <div>
                  <AppText instancetype="WithCellToken" fz={12}>
                    {base}
                    {quote}
                  </AppText>
                </div>
              </Flex>,
              <Flex
                key={`${idx}.2`}
                justify={"space-between"}
                miw={120}
                align={"center"}
                gap={10}
              >
                <AppText instancetype="WithCellToken" fz={12}>
                  {qty} {base}
                </AppText>
              </Flex>,

              <Flex
                key={`${idx}.3`}
                justify={"space-between"}
                align={"center"}
                gap={10}
              >
                <AppText instancetype="WithCellToken" fz={12}>
                  {orderPrice}
                </AppText>
                <Box>
                  <AppButton
                    variant="outline"
                    color="gray"
                    size="compact-xs"
                  >
                    <IconEdit size={10} />
                  </AppButton>
                </Box>
              </Flex>,
              <Flex
                key={`${idx}.4`}
                justify={"space-between"}
                miw={120}
                align={"center"}
                gap={10}
              >
                <AppText instancetype="WithCellToken" fz={12}>
                  {props.Filled}/{props.Total}
                </AppText>
                <Box>
                  <AppButton
                    variant="outline"
                    color="gray"
                    size="compact-xs"
                  >
                    <IconEdit size={10} />
                  </AppButton>
                </Box>
              </Flex>,
              <Flex gap={10} align={"center"} key={`${idx}.11`}>
                {tp && sl ? (
                  <>
                    <Flex
                      align={"center"}
                      direction={"column"}
                      gap={0}
                    >
                      <AppText
                        c={"green"}
                        instancetype="WithCellToken"
                        fz={12}
                        fw={"bold"}
                      >
                        {tp}
                      </AppText>
                      <Flex align={"center"} gap={0}>
                        <AppText
                          instancetype="WithCellToken"
                          fz={12}
                          fw={"bold"}
                        >
                          /
                        </AppText>
                        <AppText
                          c={"red"}
                          instancetype="WithCellToken"
                          fz={12}
                          fw={"bold"}
                        >
                          {sl}
                        </AppText>
                      </Flex>
                    </Flex>
                    <AppButton
                      variant="outline"
                      color="gray"
                      size="compact-xs"
                    >
                      <IconEdit size={10} />
                    </AppButton>
                  </>
                ) : (
                  <AppButton
                    styles={{
                      root: {
                        background: "light-dark(#e9edf3, #414347)",
                        color: "light-dark(black, white)",
                      },
                    }}
                    size="compact-xs"
                    fz={12}
                  >
                    <IconPlus size={16} />
                    Add
                  </AppButton>
                )}
              </Flex>,
              <Box key={`${idx}.5`} miw={120}>
                <AppText
                  instancetype="WithCellToken"
                  fz={12}
                  c={"green"}
                >
                  {tradeType}
                </AppText>
              </Box>,
              <Box key={`${idx}.6`} miw={120}>
                <AppText instancetype="WithCellToken" fz={12}>
                  {orderSide}
                </AppText>
              </Box>,
              <Box key={`${idx}.7`} w={120}>
                <AppText instancetype="WithCellToken" fz={12}>
                  {reduceOnly ? "YES" : "NO"}
                </AppText>
              </Box>,
              <Box key={`${idx}.7`} miw={120}>
                <AppText instancetype="WithCellToken" fz={12}>
                  {status}
                </AppText>
              </Box>,
              <Box key={`${idx}.8`} miw={120}>
                <AppText instancetype="WithCellToken" fz={12}>
                  {props.No}
                </AppText>
              </Box>,
              <Box key={`${idx}.9`} miw={140}>
                <AppText instancetype="WithCellToken" fz={12}>
                  {fmtDate(orderTime)}
                </AppText>
              </Box>,
              <AppButton
                key={`${idx}.10`}
                styles={{
                  root: {
                    background: "light-dark(#e9edf3, #414347)",
                    color: "light-dark(black, white)",
                  },
                }}
                size="xs"
                fz={12}
              >
                Cancel
              </AppButton>,
            ],
          ),
      },
      Conditional: {
        items: [
          ["Contracts"],
          ["Qty"],
          ["Trigger Price"],
          ["Price (Distance)"],
          ["Order Price"],
          ["TP / SL"],
          ["Trade Type"],
          ["Reduce-Only"],
          ["Status"],
          ["Order No."],
          ["Order Time"],
          ["Actions"],
        ],
        rows: [...Array(20)]
          .map(() => ({
            icon: "https://www.bybit.com/bycsi-root/fop/9e97acce-0ffd-4148-8248-1720f6758fa0.svg",
            base: "BTC",
            quote: "USDT",
            qty: -960.551 + Math.floor(Math.random() * 20),
            entryPrice: 67534.1 + Math.floor(Math.random() * 20),
            exitPrice: 67534.1 + Math.floor(Math.random() * 20),
            orderPrice: 67534.1 + Math.floor(Math.random() * 20),
            liqPrice: [67534.1, null][Math.floor(Math.random() * 2)],
            triggerPrice: 67534.1 + Math.floor(Math.random() * 20),
            price: "0.06008 (-0.05958)",

            value: 67534.1 + Math.floor(Math.random() * 20),
            filledTotal: 67534.1 + Math.floor(Math.random() * 20),
            tp: [67534.1 + 100, null][Math.floor(Math.random() * 2)],
            sl: [67534.1 - 100, null][Math.floor(Math.random() * 2)],
            tradeType: [
              "Close Short",
              "Close Long",
              "Open Long",
              "Open Short",
            ][Math.floor(Math.random() * 4)],
            orderSide: ["Limit", "Market"][
              Math.floor(Math.random() * 2)
            ],
            reduceOnly: [true, false][Math.floor(Math.random() * 2)],
            status: ["Active", "Closed"][
              Math.floor(Math.random() * 2)
            ],
            No: "c8891a7b",
            orderTime: Date.now() + Math.floor(Math.random() * 100),
            tradeTime: Date.now() + Math.floor(Math.random() * 100),
            isBuy: [true, false][Math.floor(Math.random() * 2)],
          }))
          .map(
            (
              {
                base,
                quote,
                qty,
                isBuy,
                tradeType,
                orderTime,
                triggerPrice,
                orderPrice,
                tp,
                sl,
                reduceOnly,
                status,
                ...props
              },
              idx,
            ) => [
              <Flex key={`${idx}.1`} align={"center"} gap={8}>
                <Box bg={isBuy ? "green" : "red"} w={"2px"} h={30} />
                <div>
                  <AppText instancetype="WithCellToken" fz={12}>
                    {base}
                    {quote}
                  </AppText>
                </div>
              </Flex>,
              <Flex
                key={`${idx}.2`}
                justify={"space-between"}
                miw={120}
                align={"center"}
                gap={10}
              >
                <AppText instancetype="WithCellToken" fz={12}>
                  {qty} {base}
                </AppText>
                <Box>
                  <AppButton
                    variant="outline"
                    color="gray"
                    size="compact-xs"
                  >
                    <IconEdit size={10} />
                  </AppButton>
                </Box>
              </Flex>,

              <Flex
                key={`${idx}.3`}
                justify={"space-between"}
                miw={120}
                align={"center"}
                gap={10}
              >
                <AppText
                  key={`${idx}.4`}
                  instancetype="WithCellToken"
                  fz={12}
                >
                  {`<=${triggerPrice}(Last)`}
                </AppText>
                <Box>
                  <AppButton
                    variant="outline"
                    color="gray"
                    size="compact-xs"
                  >
                    <IconEdit size={10} />
                  </AppButton>
                </Box>
              </Flex>,
              <AppText
                key={`${idx}.5`}
                instancetype="WithCellToken"
                fz={12}
                style={{ whiteSpace: "nowrap" }}
              >
                {props.price}
              </AppText>,
              <Flex
                key={`${idx}.4`}
                justify={"space-between"}
                miw={120}
                align={"center"}
                gap={10}
              >
                <AppText
                  key={`${idx}.4`}
                  instancetype="WithCellToken"
                  fz={12}
                >
                  {orderPrice}
                </AppText>
                <Box>
                  <AppButton
                    variant="outline"
                    color="gray"
                    size="compact-xs"
                  >
                    <IconEdit size={10} />
                  </AppButton>
                </Box>
              </Flex>,
              <Flex gap={10} align={"center"} key={`${idx}.11`}>
                {tp && sl ? (
                  <>
                    <Flex
                      align={"center"}
                      direction={"column"}
                      gap={0}
                    >
                      <AppText
                        c={"green"}
                        instancetype="WithCellToken"
                        fz={12}
                        fw={"bold"}
                      >
                        {tp}
                      </AppText>
                      <Flex align={"center"} gap={0}>
                        <AppText
                          instancetype="WithCellToken"
                          fz={12}
                          fw={"bold"}
                        >
                          /
                        </AppText>
                        <AppText
                          c={"red"}
                          instancetype="WithCellToken"
                          fz={12}
                          fw={"bold"}
                        >
                          {sl}
                        </AppText>
                      </Flex>
                    </Flex>
                    <AppButton
                      variant="outline"
                      color="gray"
                      size="compact-xs"
                    >
                      <IconEdit size={10} />
                    </AppButton>
                  </>
                ) : (
                  <AppButton
                    styles={{
                      root: {
                        background: "light-dark(#e9edf3, #414347)",
                        color: "light-dark(black, white)",
                      },
                    }}
                    size="compact-xs"
                    fz={12}
                  >
                    <IconPlus size={16} />
                    Add
                  </AppButton>
                )}
              </Flex>,
              <Box key={`${idx}.5`} miw={120}>
                <AppText
                  instancetype="WithCellToken"
                  fz={12}
                  c={"green"}
                >
                  {tradeType}
                </AppText>
              </Box>,
              <Box key={`${idx}.7`} w={120}>
                <AppText instancetype="WithCellToken" fz={12}>
                  {reduceOnly ? "YES" : "NO"}
                </AppText>
              </Box>,
              <Box key={`${idx}.6`} w={120}>
                <AppText instancetype="WithCellToken" fz={12}>
                  {status}
                </AppText>
              </Box>,
              <Box key={`${idx}.7`} w={120}>
                <AppText instancetype="WithCellToken" fz={12}>
                  {props.No}
                </AppText>
              </Box>,
              <Box key={`${idx}.8`} miw={140}>
                <AppText instancetype="WithCellToken" fz={12}>
                  {fmtDate(orderTime)}
                </AppText>
              </Box>,
              <AppButton
                key={`${idx}.9`}
                styles={{
                  root: {
                    background: "light-dark(#e9edf3, #414347)",
                    color: "light-dark(black, white)",
                  },
                }}
                size="xs"
                fz={12}
              >
                Cancel
              </AppButton>,
            ],
          ),
      },
      TPandSL: {
        items: [
          ["Contracts"],
          ["Qty"],
          ["Order Price"],
          ["Trigger Price"],
          ["Trade Type"],
          ["Order No."],
          ["Order Time"],
          ["Actions"],
        ],
        rows: [...Array(20)]
          .map(() => ({ ...row }))
          .map(
            (
              {
                base,
                quote,
                qty,
                isBuy,
                tradeType,
                orderTime,
                orderPrice,
                ...props
              },
              idx,
            ) => [
              <Flex key={`${idx}.1`} align={"center"} gap={8}>
                <Box bg={isBuy ? "green" : "red"} w={"2px"} h={30} />
                <div>
                  <AppText instancetype="WithCellToken" fz={12}>
                    {base}
                    {quote}
                  </AppText>
                </div>
              </Flex>,
              <Flex
                key={`${idx}.2`}
                justify={"space-between"}
                align={"center"}
                gap={10}
              >
                <AppText instancetype="WithCellToken" fz={12}>
                  {qty}
                </AppText>
              </Flex>,
              <Box key={`${idx}.3`}>
                <AppText instancetype="WithCellToken" fz={12}>
                  TP {props.triggerPriceTP}(Last)
                </AppText>
                <AppText instancetype="WithCellToken" fz={12}>
                  SL {props.triggerPriceSL}(Last)
                </AppText>
              </Box>,
              <AppText
                key={`${idx}.4`}
                instancetype="WithCellToken"
                fz={12}
              >
                {orderPrice}
              </AppText>,
              <AppText
                key={`${idx}.5`}
                instancetype="WithCellToken"
                fz={12}
              >
                {tradeType}
              </AppText>,

              <Box key={`${idx}.6`}>
                <AppText instancetype="WithCellToken" fz={12}>
                  {props.NoSL}
                </AppText>
                <AppText instancetype="WithCellToken" fz={12}>
                  {props.NoTP}
                </AppText>
              </Box>,
              <Box key={`${idx}.7`}>
                <AppText instancetype="WithCellToken" fz={12}>
                  {fmtDate(orderTime)}
                </AppText>
              </Box>,
              <AppButton
                key={`${idx}.8`}
                styles={{
                  root: {
                    background: "light-dark(#e9edf3, #414347)",
                    color: "light-dark(black, white)",
                  },
                }}
                size="xs"
                fz={12}
              >
                Cancel
              </AppButton>,
            ],
          ),
      },
      TrailingStop: {
        items: [
          ["Contracts"],
          ["Qty"],
          ["Order Price"],
          ["Trigger Price"],
          ["Price (Distance)"],
          ["Retracement"],
          ["Activation Price"],
          ["Trade Type"],
          ["Status"],
          ["Order No."],
          ["Order Time"],
          ["Actions"],
        ],
        rows: [...Array(20)]
          .map(() => ({ ...row }))
          .map(
            (
              {
                base,
                quote,
                qty,
                isBuy,
                tradeType,
                orderTime,
                orderSide,
                orderPrice,
                tp,
                sl,
                reduceOnly,
                status,
                ...props
              },
              idx,
            ) => [
              <Flex key={`${idx}.1`} align={"center"} gap={8}>
                <Box bg={isBuy ? "green" : "red"} w={"2px"} h={30} />
                <div>
                  <AppText instancetype="WithCellToken" fz={12}>
                    {base}
                    {quote}
                  </AppText>
                </div>
              </Flex>,
              <Flex
                key={`${idx}.2`}
                justify={"space-between"}
                miw={120}
                align={"center"}
                gap={10}
              >
                <AppText instancetype="WithCellToken" fz={12}>
                  {qty} {base}
                </AppText>
              </Flex>,

              <Flex
                key={`${idx}.3`}
                justify={"space-between"}
                align={"center"}
                gap={10}
              >
                <AppText instancetype="WithCellToken" fz={12}>
                  {orderPrice}
                </AppText>
                <Box>
                  <AppButton
                    variant="outline"
                    color="gray"
                    size="compact-xs"
                  >
                    <IconEdit size={10} />
                  </AppButton>
                </Box>
              </Flex>,
              <Flex
                key={`${idx}.4`}
                justify={"space-between"}
                miw={120}
                align={"center"}
                gap={10}
              >
                <AppText
                  key={`${idx}.4`}
                  instancetype="WithCellToken"
                  fz={12}
                >
                  {props.Filled}/{props.Total}
                </AppText>
                <Box>
                  <AppButton
                    variant="outline"
                    color="gray"
                    size="compact-xs"
                  >
                    <IconEdit size={10} />
                  </AppButton>
                </Box>
              </Flex>,
              <Flex gap={10} align={"center"} key={`${idx}.11`}>
                {tp && sl ? (
                  <>
                    <Flex
                      align={"center"}
                      direction={"column"}
                      gap={0}
                    >
                      <AppText
                        c={"green"}
                        instancetype="WithCellToken"
                        fz={12}
                        fw={"bold"}
                      >
                        {tp}
                      </AppText>
                      <Flex align={"center"} gap={0}>
                        <AppText
                          instancetype="WithCellToken"
                          fz={12}
                          fw={"bold"}
                        >
                          /
                        </AppText>
                        <AppText
                          c={"red"}
                          instancetype="WithCellToken"
                          fz={12}
                          fw={"bold"}
                        >
                          {sl}
                        </AppText>
                      </Flex>
                    </Flex>
                    <AppButton
                      variant="outline"
                      color="gray"
                      size="compact-xs"
                    >
                      <IconEdit size={10} />
                    </AppButton>
                  </>
                ) : (
                  <AppButton
                    styles={{
                      root: {
                        background: "light-dark(#e9edf3, #414347)",
                        color: "light-dark(black, white)",
                      },
                    }}
                    size="compact-xs"
                    fz={12}
                  >
                    <IconPlus size={16} />
                    Add
                  </AppButton>
                )}
              </Flex>,
              <Box key={`${idx}.5`} miw={120}>
                <AppText
                  instancetype="WithCellToken"
                  fz={12}
                  c={"green"}
                >
                  {tradeType}
                </AppText>
              </Box>,
              <Box key={`${idx}.6`} miw={120}>
                <AppText instancetype="WithCellToken" fz={12}>
                  {orderSide}
                </AppText>
              </Box>,
              <Box key={`${idx}.7`} w={120}>
                <AppText instancetype="WithCellToken" fz={12}>
                  {reduceOnly ? "YES" : "NO"}
                </AppText>
              </Box>,
              <Box key={`${idx}.7`} w={120}>
                <AppText instancetype="WithCellToken" fz={12}>
                  {status}
                </AppText>
              </Box>,
              <Box key={`${idx}.8`} w={120}>
                <AppText instancetype="WithCellToken" fz={12}>
                  {props.No}
                </AppText>
              </Box>,
              <Box key={`${idx}.9`} miw={140}>
                <AppText instancetype="WithCellToken" fz={12}>
                  {fmtDate(orderTime)}
                </AppText>
              </Box>,
              <AppButton
                key={`${idx}.10`}
                styles={{
                  root: {
                    background: "light-dark(#e9edf3, #414347)",
                    color: "light-dark(black, white)",
                  },
                }}
                size="xs"
                fz={12}
              >
                Cancel
              </AppButton>,
            ],
          ),
      },
      MMRClose: {
        items: [
          ["Contracts"],
          ["Qty"],
          ["Trigger MMR"],
          ["Order Price"],
          ["Trade Type"],
          ["Status"],
          ["Order No."],
          ["Order Time"],
          ["Actions"],
        ],
        rows: [...Array(20)]
          .map(() => ({ ...row }))
          .map(
            (
              {
                base,
                quote,

                qty,
                isBuy,
                tradeType,
                orderTime,
                orderPrice,
                status,
                ...props
              },
              idx,
            ) => [
              <Flex key={`${idx}.1`} align={"center"} gap={8}>
                <Box bg={isBuy ? "green" : "red"} w={"2px"} h={30} />
                <div>
                  <AppText instancetype="WithCellToken" fz={12}>
                    {base}
                    {quote}
                  </AppText>
                </div>
              </Flex>,
              <Flex
                key={`${idx}.2`}
                justify={"space-between"}
                align={"center"}
                gap={10}
              >
                <AppText instancetype="WithCellToken" fz={12}>
                  {qty}
                </AppText>
              </Flex>,
              <Box key={`${idx}.3`}>
                <AppText instancetype="WithCellToken" fz={12}>
                  TP {props.triggerPriceTP}(Last)
                </AppText>
                <AppText instancetype="WithCellToken" fz={12}>
                  SL {props.triggerPriceSL}(Last)
                </AppText>
              </Box>,
              <AppText
                key={`${idx}.4`}
                instancetype="WithCellToken"
                fz={12}
              >
                {orderPrice}
              </AppText>,
              <AppText
                key={`${idx}.5`}
                instancetype="WithCellToken"
                fz={12}
              >
                {tradeType}
              </AppText>,
              <AppText
                key={`${idx}.6`}
                instancetype="WithCellToken"
                fz={12}
              >
                {status}
              </AppText>,

              <Box key={`${idx}.7`}>
                <AppText instancetype="WithCellToken" fz={12}>
                  {props.NoSL}
                </AppText>
                <AppText instancetype="WithCellToken" fz={12}>
                  {props.NoTP}
                </AppText>
              </Box>,
              <Box key={`${idx}.8`}>
                <AppText instancetype="WithCellToken" fz={12}>
                  {fmtDate(orderTime)}
                </AppText>
              </Box>,
              <AppButton
                key={`${idx}.9`}
                styles={{
                  root: {
                    background: "light-dark(#e9edf3, #414347)",
                    color: "light-dark(black, white)",
                  },
                }}
                size="xs"
                fz={12}
              >
                Cancel
              </AppButton>,
            ],
          ),
      },
    }[_type as string];
    return {
      head: (data?.items || []).map(([text, tooltip], i) => {
        return (
          <div key={i}>
            {tooltip ? (
              <AppPopover
                withArrow={false}
                target={(props) => ({
                  children: (
                    <AppText
                      className="cursor-pointer"
                      fz={12}
                      c={"#71757a"}
                      onMouseEnter={props.open}
                      onMouseLeave={props.close}
                      style={{
                        whiteSpace: "nowrap",
                        width: "fit-content",
                      }}
                    >
                      {text}
                    </AppText>
                  ),
                })}
                dropdown={() => ({
                  children: (
                    <AppText instancetype="WithTextTooltip">
                      {tooltip}
                    </AppText>
                  ),
                })}
              ></AppPopover>
            ) : (
              <AppText
                className="cursor-pointer"
                fz={12}
                c={"#71757a"}
                style={{
                  whiteSpace: "nowrap",
                  width: "fit-content",
                }}
              >
                {text}
              </AppText>
            )}
          </div>
        );
      }),
      body: data?.rows,
    };
  },
  orderHistory: (_type = "limitAndMarket") => {
    const data = {
      limitAndMarket: {
        items: [
          ["Contracts"],
          ["Filled/Total"],
          ["Filled Price/Order Price"],
          ["Trade Type"],
          ["Order Type"],
          ["Status"],
          ["Order No."],
          ["Order Time"],
        ],
        rows: [...Array(20)]
          .map(() => ({ ...row }))
          .map(
            (
              {
                base,
                quote,
                isBuy,
                tradeType,
                orderTime,
                orderSide,
                orderPrice,
                status,
                ...props
              },
              idx,
            ) => [
              <Flex key={`${idx}.1`} align={"center"} gap={8}>
                <Box bg={isBuy ? "green" : "red"} w={"2px"} h={30} />
                <div>
                  <AppText instancetype="WithCellToken" fz={12}>
                    {base}
                    {quote}
                  </AppText>
                </div>
              </Flex>,
              <AppText
                key={`${idx}.2`}
                instancetype="WithCellToken"
                fz={12}
              >
                {props.Filled}/{props.Total}
              </AppText>,
              <AppText
                key={`${idx}.4`}
                instancetype="WithCellToken"
                fz={12}
              >
                {props.FilledPrice}/{orderPrice}
              </AppText>,
              <AppText
                key={`${idx}.4`}
                instancetype="WithCellToken"
                fz={12}
              >
                {tradeType}
              </AppText>,
              <AppText
                key={`${idx}.5`}
                instancetype="WithCellToken"
                fz={12}
              >
                {orderSide}
              </AppText>,
              <AppText
                key={`${idx}.6`}
                instancetype="WithCellToken"
                fz={12}
              >
                {status}
              </AppText>,
              <AppText
                key={`${idx}.7`}
                instancetype="WithCellToken"
                fz={12}
              >
                {props.No}
              </AppText>,
              <Box key={`${idx}.8`} miw={140}>
                <AppText instancetype="WithCellToken" fz={12}>
                  {fmtDate(orderTime)}
                </AppText>
              </Box>,
            ],
          ),
      },
      Conditional: {
        items: [
          ["Contracts"],
          ["Filled/Actual Qty"],
          ["Filled Price/Order Price"],
          ["Trigger Price"],
          ["Trade Type"],
          ["Status"],
          ["Order No."],
          ["Order Time"],
        ],
        rows: [...Array(20)]
          .map(() => ({ ...row }))
          .map(({ ...props }, idx) => [
            <Flex key={`${idx}.1`} align={"center"} gap={8}>
              <Box
                bg={props.isBuy ? "green" : "red"}
                w={"2px"}
                h={30}
              />
              <div>
                <AppText instancetype="WithCellToken" fz={12}>
                  {props.base}
                  {props.quote}
                </AppText>
              </div>
            </Flex>,
            <AppText
              key={`${idx}.2`}
              instancetype="WithCellToken"
              fz={12}
            >
              {props.Filled}/{props.actualQty}
            </AppText>,
            <AppText
              key={`${idx}.3`}
              instancetype="WithCellToken"
              fz={12}
            >
              {props.FilledPrice}/{props.orderPrice}
            </AppText>,
            <AppText
              key={`${idx}.4`}
              instancetype="WithCellToken"
              fz={12}
            >
              {props.triggerPrice}
            </AppText>,
            <AppText
              key={`${idx}.5`}
              instancetype="WithCellToken"
              fz={12}
            >
              {props.tradeType}
            </AppText>,
            <AppText
              key={`${idx}.6`}
              instancetype="WithCellToken"
              fz={12}
            >
              {props.status}
            </AppText>,
            <AppText
              key={`${idx}.7`}
              instancetype="WithCellToken"
              fz={12}
            >
              {props.No}
            </AppText>,
            <Box key={`${idx}.8`} miw={140}>
              <AppText instancetype="WithCellToken" fz={12}>
                {fmtDate(props.orderTime)}
              </AppText>
            </Box>,
          ]),
      },
      TPandSL: {
        items: [
          ["Contracts"],
          ["Filled/Actual Qty"],
          ["Trigger Price"],
          ["Filled Price/Order Price"],
          ["Trade Type"],
          ["Status"],
          ["Order No."],
          ["Order Time"],
        ],
        rows: [...Array(20)]
          .map(() => ({ ...row }))
          .map(({ ...props }, idx) => [
            <Flex key={`${idx}.1`} align={"center"} gap={8}>
              <Box
                bg={props.isBuy ? "green" : "red"}
                w={"2px"}
                h={30}
              />
              <div>
                <AppText instancetype="WithCellToken" fz={12}>
                  {props.base}
                  {props.quote}
                </AppText>
              </div>
            </Flex>,
            <AppText
              key={`${idx}.2`}
              instancetype="WithCellToken"
              fz={12}
            >
              {props.Filled}/{props.actualQty}
            </AppText>,
            <AppText
              key={`${idx}.3`}
              instancetype="WithCellToken"
              fz={12}
            >
              {props.FilledPrice}/{props.orderPrice}
            </AppText>,
            <AppText
              key={`${idx}.4`}
              instancetype="WithCellToken"
              fz={12}
            >
              {props.triggerPrice}
            </AppText>,
            <AppText
              key={`${idx}.5`}
              instancetype="WithCellToken"
              fz={12}
            >
              {props.tradeType}
            </AppText>,
            <AppText
              key={`${idx}.6`}
              instancetype="WithCellToken"
              fz={12}
            >
              {props.status}
            </AppText>,
            <AppText
              key={`${idx}.7`}
              instancetype="WithCellToken"
              fz={12}
            >
              {props.No}
            </AppText>,
            <Box key={`${idx}.8`} miw={140}>
              <AppText instancetype="WithCellToken" fz={12}>
                {fmtDate(props.orderTime)}
              </AppText>
            </Box>,
          ]),
      },
      TrailingStop: {
        items: [
          ["Contracts"],
          ["Filled/Actual Qty"],
          ["Filled Price/Order Price"],
          ["Trigger Price"],
          ["Trade Type"],
          ["Status"],
          ["Order No."],
          ["Order Time"],
        ],
        rows: [...Array(20)]
          .map(() => ({ ...row }))
          .map(({ ...props }, idx) => [
            <Flex key={`${idx}.1`} align={"center"} gap={8}>
              <Box
                bg={props.isBuy ? "green" : "red"}
                w={"2px"}
                h={30}
              />
              <div>
                <AppText instancetype="WithCellToken" fz={12}>
                  {props.base}
                  {props.quote}
                </AppText>
              </div>
            </Flex>,
            <AppText
              key={`${idx}.2`}
              instancetype="WithCellToken"
              fz={12}
            >
              {props.Filled}/{props.actualQty}
            </AppText>,
            <AppText
              key={`${idx}.3`}
              instancetype="WithCellToken"
              fz={12}
            >
              {props.triggerPrice}
            </AppText>,
            <AppText
              key={`${idx}.4`}
              instancetype="WithCellToken"
              fz={12}
            >
              {props.FilledPrice}/{props.orderPrice}
            </AppText>,
            <AppText
              key={`${idx}.5`}
              instancetype="WithCellToken"
              fz={12}
            >
              {props.tradeType}
            </AppText>,
            <AppText
              key={`${idx}.6`}
              instancetype="WithCellToken"
              fz={12}
            >
              {props.status}
            </AppText>,
            <AppText
              key={`${idx}.7`}
              instancetype="WithCellToken"
              fz={12}
            >
              {props.No}
            </AppText>,
            <Box key={`${idx}.8`} miw={140}>
              <AppText instancetype="WithCellToken" fz={12}>
                {fmtDate(props.orderTime)}
              </AppText>
            </Box>,
          ]),
      },
      MMRClose: {
        items: [
          ["Contracts"],
          ["Filled/Actual Qty"],
          ["Trigger MMR"],
          ["Filled Price/Order Price"],
          ["Trade Type"],
          ["Status"],
          ["Order No."],
          ["Order Time"],
        ],
        rows: [...Array(20)]
          .map(() => ({ ...row }))
          .map(({ ...props }, idx) => [
            <Flex key={`${idx}.1`} align={"center"} gap={8}>
              <Box
                bg={props.isBuy ? "green" : "red"}
                w={"2px"}
                h={30}
              />
              <div>
                <AppText instancetype="WithCellToken" fz={12}>
                  {props.base}
                  {props.quote}
                </AppText>
              </div>
            </Flex>,
            <AppText
              key={`${idx}.2`}
              instancetype="WithCellToken"
              fz={12}
            >
              {props.Filled}/{props.actualQty}
            </AppText>,
            <AppText
              key={`${idx}.3`}
              instancetype="WithCellToken"
              fz={12}
            >
              {props.triggerMMR}%
            </AppText>,
            <AppText
              key={`${idx}.4`}
              instancetype="WithCellToken"
              fz={12}
            >
              {props.FilledPrice}/{props.orderPrice}
            </AppText>,
            <AppText
              key={`${idx}.5`}
              instancetype="WithCellToken"
              fz={12}
            >
              {props.tradeType}
            </AppText>,
            <AppText
              key={`${idx}.6`}
              instancetype="WithCellToken"
              fz={12}
            >
              {props.status}
            </AppText>,
            <AppText
              key={`${idx}.7`}
              instancetype="WithCellToken"
              fz={12}
            >
              {props.No}
            </AppText>,
            <Box key={`${idx}.8`} miw={140}>
              <AppText instancetype="WithCellToken" fz={12}>
                {fmtDate(props.orderTime)}
              </AppText>
            </Box>,
          ]),
      },
    }[_type as string];
    return {
      head: (data?.items || []).map(([text, tooltip], i) => {
        return (
          <div key={i}>
            {tooltip ? (
              <AppPopover
                withArrow={false}
                target={(props) => ({
                  children: (
                    <AppText
                      className="cursor-pointer"
                      fz={12}
                      c={"#71757a"}
                      onMouseEnter={props.open}
                      onMouseLeave={props.close}
                      style={{
                        whiteSpace: "nowrap",
                        width: "fit-content",
                      }}
                    >
                      {text}
                    </AppText>
                  ),
                })}
                dropdown={() => ({
                  children: (
                    <AppText instancetype="WithTextTooltip">
                      {tooltip}
                    </AppText>
                  ),
                })}
              ></AppPopover>
            ) : (
              <AppText
                className="cursor-pointer"
                fz={12}
                c={"#71757a"}
                style={{
                  whiteSpace: "nowrap",
                  width: "fit-content",
                }}
              >
                {text}
              </AppText>
            )}
          </div>
        );
      }),
      body: data?.rows,
    };
  },
  tradeHistory: () => {
    const _items = [
      ["Contracts"],
      ["Filled/Total"],
      ["Filled Price/Order Price"],
      ["Trade Type"],
      ["Order Type"],
      ["Filled Type"],
      ["Transaction ID"],
      ["Transaction Time"],
    ];
    const rows = [...Array(20)]
      .map(() => ({ ...row }))
      .map(({ ...props }, idx) => [
        <Flex key={`${idx}.1`} align={"center"} gap={8}>
          <Box bg={props.isBuy ? "green" : "red"} w={"2px"} h={30} />
          <div>
            <AppText instancetype="WithCellToken" fz={12}>
              {props.base}
              {props.quote}
            </AppText>
          </div>
        </Flex>,
        <AppText
          key={`${idx}.2`}
          instancetype="WithCellToken"
          fz={12}
        >
          {props.Filled} / {props.Total}
        </AppText>,
        <AppText
          key={`${idx}.3`}
          instancetype="WithCellToken"
          fz={12}
        >
          {props.FilledPrice} / {props.orderPrice}
        </AppText>,
        <AppText
          key={`${idx}.4`}
          instancetype="WithCellToken"
          fz={12}
        >
          {props.tradeType}
        </AppText>,
        <AppText
          key={`${idx}.5`}
          instancetype="WithCellToken"
          fz={12}
        >
          {props.orderSide}
        </AppText>,
        <AppText
          key={`${idx}.6`}
          instancetype="WithCellToken"
          fz={12}
        >
          {props.filledType}
        </AppText>,
        <AppText
          key={`${idx}.7`}
          instancetype="WithCellToken"
          fz={12}
        >
          {props.transactionID}
        </AppText>,
        <Box key={`${idx}.8`}>
          <AppText instancetype="WithCellToken" fz={12}>
            {new Date(props.transactionTime).toLocaleString()}
          </AppText>
        </Box>,
      ]);
    return {
      head: _items.map(([text, tooltip], i) => {
        return (
          <div key={i}>
            {tooltip ? (
              <AppPopover
                withArrow={false}
                target={(props) => ({
                  children: (
                    <AppText
                      className="cursor-pointer"
                      fz={12}
                      c={"#71757a"}
                      onMouseEnter={props.open}
                      onMouseLeave={props.close}
                      style={{
                        whiteSpace: "nowrap",
                        width: "fit-content",
                      }}
                    >
                      {text}
                    </AppText>
                  ),
                })}
                dropdown={() => ({
                  children: (
                    <AppText instancetype="WithTextTooltip">
                      {tooltip}
                    </AppText>
                  ),
                })}
              ></AppPopover>
            ) : (
              <AppText
                className="cursor-pointer"
                fz={12}
                c={"#71757a"}
                style={{
                  whiteSpace: "nowrap",
                  width: "fit-content",
                }}
              >
                {text}
              </AppText>
            )}
          </div>
        );
      }),
      body: rows,
    };
  },
  // orderHistory
};
