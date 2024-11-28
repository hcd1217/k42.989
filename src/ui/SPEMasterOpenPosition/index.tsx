import { OrderSide } from "@/common/enums";
import useSPESyncData from "@/hooks/useSPESyncData";
import { fetchMasterOpenCopyPositions } from "@/services/apis";
import { CopyPosition } from "@/types";
import {
  NoDataRecord,
  SPETableHeader,
  SPETableMarkPrice,
  SPETableNumber,
  SPETableSide,
  SPETableSymbol,
  SPEUnrealizedPnL,
} from "@/ui/SPEMisc";
import { Box, Table, TableData } from "@mantine/core";
import { useCallback, useMemo } from "react";

export default function SPEMasterOpenPosition({
  masterAccountId,
  noFollowerInfo,
}: {
  masterAccountId: string;
  noFollowerInfo?: boolean;
}) {
  const fetch = useCallback(() => {
    return fetchMasterOpenCopyPositions(masterAccountId);
  }, [masterAccountId]);

  const positions = useSPESyncData<CopyPosition[]>(fetch, 15e3);

  const tableData: TableData = useMemo(() => {
    return {
      // prettier-ignore
      head: [
        "Contract",
        "Side",
        noFollowerInfo ? "Master's Volume":
          ["Master's Volume", "Followers' Volume"],
        "Entry Price",
        "Mark Price",
        noFollowerInfo ? "Masters' Margin (USDT)" : ["Masters' Margin (USDT)", "Followers' Margin (USDT)"],
        noFollowerInfo
          ? "Unrealized PnL (USDT)"
          : [
            "Masters' Unrealized PnL (USDT)",
            "Followers' Unrealized PnL (USDT)",
          ],
      ].map((label, idx) => (
        <SPETableHeader key={idx} label={label} />
      )),
      body: positions?.map((position, idx) => {
        const color =
          position.side === OrderSide.BUY ? "green" : "red";
        return [
          <SPETableSymbol
            color={color}
            key={`${idx}.${position.symbol}`}
            symbol={position.symbol}
          />,
          <SPETableSide
            key={`${idx}.side`}
            color={color}
            side={position.side}
          />,
          <Box key={`${idx}.size`}>
            <SPETableNumber value={position.volume} />
            <SPETableNumber value={position.followerVolume} />
          </Box>,
          <SPETableNumber
            key={`${idx}.price`}
            value={position.entryPrice}
          />,
          <SPETableMarkPrice
            key={`${idx}.markPrice`}
            symbol={position.symbol}
          />,
          <Box key={`${idx}.margin`}>
            <SPETableNumber value={position.margin} />
            <SPETableNumber value={position.followerMargin} />
          </Box>,
          <Box key={`${idx}.pnl`}>
            <SPEUnrealizedPnL position={position} />
            <SPEUnrealizedPnL
              position={{
                symbol: position.symbol,
                side: position.side,
                volume: position.followerVolume,
                entryPrice: position.followerAverageEntryPrice,
                fee: position.followerFee,
              }}
            />
          </Box>,
        ];
      }),
    };
  }, [noFollowerInfo, positions]);
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
      {tableData.body?.length === 0 ? <NoDataRecord /> : <></>}
    </Table.ScrollContainer>
  );
}
