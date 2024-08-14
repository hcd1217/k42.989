import { fetch } from "@/services/apis";
import { TradeList } from "@/types";
import { NoDataRecord } from "@/ui/SPEMisc";
import {
  Box,
  Flex,
  NumberFormatter,
  Table,
  TableData,
  Text,
} from "@mantine/core";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";

export function GridRecentTrade() {
  const { base, quote } = useParams();
  const { data } = useSWR<TradeList[]>(
    `/api/market/trade-list?symbol=${base}${quote}`,
    fetch,
  );

  const dataTable = useMemo(() => {
    const c = ["#ec4349", "#21b16b"];
    const icons = [
      <IconArrowDown key="1" color={c[0]} size={16} />,
      <IconArrowUp key="2" color={c[1]} size={16} />,
    ];
    const length = Math.min(data?.length || 0, 40);
    // <NoDataRecord />
    const tableData: TableData = {
      head: [
        <Box key="1" w={"100px"}>
          Price(USDT)
        </Box>,
        <Flex key="2" justify={"end"}>
          Qty(BTC)
        </Flex>,
        <Flex key="3" justify={"end"}>
          Time
        </Flex>,
      ],
      body: Array.from({ length }).map((_, i) => {
        const price = data?.[i]?.price; // Math.random() * 10e6;
        const isUp = data?.[i]?.side === "BUY"; // c[r()] === c[1];
        const color = isUp ? c[1] : c[0];
        const icon = isUp ? icons[1] : icons[0];
        const qty = data?.[i]?.volume; // Math.random() * (0.03 - 0.1) + 0.1;
        const time = dayjs(data?.[i]?.timestamp).format("HH:mm:ss");
        return [
          <>
            <Flex
              align={"center"}
              w={"100px"}
              justify={"space-between"}
              gap={10}
            >
              <NumberFormatter
                style={{
                  color,
                  fontSize: "12px",
                  fontWeight: "500",
                  width: "72px",
                }}
                value={price}
                fixedDecimalScale
                decimalScale={2}
                thousandSeparator
              />
              <Flex>{icon}</Flex>
            </Flex>
          </>,
          <Flex key="1" justify={"end"}>
            <NumberFormatter
              style={{
                fontSize: "12px",
                color: "light-dark(dark, white)",
                fontWeight: "600",
              }}
              value={qty}
              fixedDecimalScale
              decimalScale={3}
              thousandSeparator
            />
          </Flex>,
          <Flex key="2" justify={"end"}>
            <Text
              style={{
                fontSize: "12px",
                color: "light-dark(dark, white)",
                fontWeight: "600",
              }}
            >
              {time}
            </Text>
          </Flex>,
        ];
      }),
    };
    return tableData;
  }, [data]);

  return (
    <>
      <>
        <Table.ScrollContainer minWidth={"100%"} h={"100%"}>
          <Table
            styles={{
              thead: {
                // background: "#101014",
                background: "light-dark(#ffffff, #101014)",
              },
              th: {
                fontSize: "12px",
                fontWeight: 500,
                padding: "10px 10px",
              },
            }}
            data={dataTable}
            stickyHeader
            verticalSpacing={2}
            withRowBorders={false}
          />
          {dataTable.body?.length === 0 && <NoDataRecord />}
        </Table.ScrollContainer>
      </>
    </>
  );
}
