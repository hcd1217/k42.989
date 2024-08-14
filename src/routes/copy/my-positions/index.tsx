import { OrderSide } from "@/common/enums";
import { fetchCopyOpenPositions } from "@/services/apis";
import { CopyPosition } from "@/types";
import { MasterTrader } from "@/ui/Copy";
import {
  NoDataRecord,
  SPETableDateTime,
  SPETableHeader,
  SPETableMarkPrice,
  SPETableNumber,
  SPETableSide,
  SPETableSymbol,
  SPEUnrealizedPnL,
} from "@/ui/SPEMisc";
import { Box, Table, TableData } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";

export default function MyOrders() {
  // const t = useSPETranslation();
  const [positions, setPositions] = useState<CopyPosition[]>([]);
  useEffect(() => {
    fetchCopyOpenPositions().then(setPositions);
  }, []);
  const tableData: TableData = useMemo(() => {
    return {
      head: [
        "Trader",
        "Contract",
        "Side",
        "Price",
        "Mark Price",
        "Volume",
        "Margin",
        "Realized PnL",
        "Time",
      ].map((label, idx) => (
        <SPETableHeader key={idx} label={label} />
      )),

      body: positions.map((position) => {
        const color =
          position.side === OrderSide.BUY ? "green" : "red";
        return [
          <>
            <MasterTrader
              key={`${position.positionId}.avatar`}
              name={position.trader?.name}
              avatar={position.trader?.avatar}
            />
          </>,
          <SPETableSymbol
            color={color}
            key={`${position.positionId}.symbol`}
            symbol={position.symbol}
          />,
          <SPETableSide
            key={`${position.positionId}.side`}
            color={color}
            side={position.side}
          />,
          <SPETableNumber
            key={`${position.positionId}.price`}
            value={position.entryPrice}
          />,
          <SPETableMarkPrice
            key={`${position.positionId}.markPrice`}
            symbol={position.symbol}
          />,
          <SPETableNumber
            key={`${position.positionId}.volume`}
            value={position.volume}
          />,
          <SPETableNumber
            key={`${position.positionId}.marginLevel`}
            value={position.margin}
          />,
          <SPEUnrealizedPnL
            key={`${position.positionId}.pnl`}
            position={position}
          />,
          <SPETableDateTime
            key={`${position.positionId}.time`}
            time={position.createdAt}
          />,
        ];
      }),
    };
  }, [positions]);

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
      </Table.ScrollContainer>
    </Box>
  );
}
