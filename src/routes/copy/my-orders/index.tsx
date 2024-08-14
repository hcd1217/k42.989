import { OrderSide } from "@/common/enums";
import useSPEPagination from "@/hooks/useSPEPagination";
import { fetchCopyOrders } from "@/services/apis";
import { MasterTrader } from "@/ui/Copy";
import {
  NoDataRecord,
  SPEPagination,
  SPETableHeader,
  SPETableNumber,
  SPETableSymbol,
} from "@/ui/SPEMisc";
import { Box, Table, TableData } from "@mantine/core";
import { useCallback, useMemo } from "react";

export default function MyPositions() {
  const fetch = useCallback(
    (cursor: string, limit: number, reverse: boolean) => {
      return fetchCopyOrders(cursor, reverse, limit);
    },
    [],
  );

  const {
    data: orders,
    havePreviousPage,
    haveNextPage,
    goPrev,
    goNext,
  } = useSPEPagination(fetch);

  const tableData: TableData = useMemo(
    () => ({
      head: [
        "Trader",
        "Contract",
        "Price",
        "Volume",
        "Margin",
        "Realized PnL",
      ].map((label, idx) => (
        <SPETableHeader key={idx} label={label} />
      )),
      body: orders.map((order) => {
        const color = order.side === OrderSide.BUY ? "green" : "red";
        return [
          <MasterTrader
            key={`${order.orderId}.avatar`}
            name={order.trader?.name}
            avatar={order.trader?.avatar}
          />,
          <SPETableSymbol
            color={color}
            key={`${order.orderId}.symbol`}
            symbol={order.symbol}
          />,
          <SPETableNumber
            key={`${order.orderId}.price`}
            value={order.avgPrice}
          />,
          <SPETableNumber
            key={`${order.orderId}.volume`}
            value={order.filled}
          />,
          <SPETableNumber
            key={`${order.orderId}.margin`}
            value={0}
          />,
          <SPETableNumber key={`${order.orderId}.pnl`} value={0} />,
        ];
      }),
    }),
    [orders],
  );

  return (
    <Box h={"100%"} w={"100%"}>
      <Table.ScrollContainer minWidth={"100%"} h={"100%"}>
        <Table
          data={tableData}
          stickyHeader
          highlightOnHover
          styles={{
            th: {
              whiteSpace: "nowrap",
              fontSize: "12px",
            },
          }}
          classNames={{
            table: "table-sticky-column table-list-gird-view",
          }}
        />
        <>{tableData.body?.length === 0 && <NoDataRecord />}</>
        <SPEPagination
          goPrev={goPrev}
          goNext={goNext}
          havePreviousPage={havePreviousPage}
          haveNextPage={haveNextPage}
        />
      </Table.ScrollContainer>
    </Box>
  );
}
