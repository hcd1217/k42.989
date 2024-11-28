// /Users/hau/projects/mts/simple-proxy-exchange/web/src/ui/

import BN from "@/common/big-number";
import { OrderSide } from "@/common/enums";
import { positionMargin } from "@/common/logic";
import useSPEPagination from "@/hooks/useSPEPagination";
import { fetchMasterCopyOrders } from "@/services/apis";
import {
  NoDataRecord,
  SPEPagination,
  SPETableDateTime,
  SPETableHeader,
  SPETableNumber,
  SPETableSide,
  SPETableSymbol,
} from "@/ui/SPEMisc";
import { valueColor } from "@/utils/utility";
import { Table, TableData } from "@mantine/core";
import { useCallback, useMemo } from "react";

export default function SPEMasterOrderHistory({
  masterAccountId,
  noMargin,
  noFollower,
}: {
  masterAccountId: string;
  noFollower?: boolean;
  noMargin?: boolean;
}) {
  const fetch = useCallback(
    (cursor: string, limit: number, reverse: boolean) => {
      return fetchMasterCopyOrders(
        masterAccountId,
        cursor,
        reverse,
        limit,
      );
    },
    [masterAccountId],
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
        "Contract",
        "Side",
        "Price (USDT)",
        "Volume",
        noMargin ? undefined : "Margin (USDT)",
        "Realized PnL",
        noFollower ? undefined : "Followers",
        "Time",
      ]
        .filter(Boolean)
        .map((label, idx) => (
          <SPETableHeader key={idx} label={label || ""} />
        )),
      body: orders.map((order) => {
        const color = order.side === OrderSide.BUY ? "green" : "red";
        const margin = positionMargin(
          order.avgPrice || 0,
          BN.sub(order.volume, order.reduceVolume),
          order.leverage || 1,
        );
        return [
          <SPETableSymbol
            color={color}
            key={`${order.orderId}.symbol`}
            symbol={order.symbol}
          />,
          <SPETableSide
            color={color}
            key={`${order.orderId}.side`}
            side={order.side}
          />,
          <SPETableNumber
            key={`${order.orderId}.price`}
            value={order.avgPrice}
          />,
          <SPETableNumber
            key={`${order.orderId}.volume`}
            value={order.volume}
          />,
          noMargin ? undefined : (
            <SPETableNumber
              key={`${order.orderId}.margin`}
              value={noMargin ? margin : 0}
            />
          ),
          <SPETableNumber
            color={valueColor(order.realizedPnl || 0)}
            key={`${order.orderId}.pnl`}
            value={order.realizedPnl}
          />,
          noFollower ? undefined : (
            <span key={`${order.orderId}.followers`}>
              {order.totalFollowers ? (
                order.totalFollowers.toLocaleString()
              ) : (
                <SPETableNumber value={order.totalFollowers} />
              )}
            </span>
          ),
          <SPETableDateTime
            key={`${order.orderId}.time`}
            time={order.createdAt}
          />,
        ].filter(Boolean);
      }),
    }),
    [noMargin, noFollower, orders],
  );

  return (
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
  );
}
