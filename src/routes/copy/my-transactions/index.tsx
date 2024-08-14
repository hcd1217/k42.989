import useSPEPagination from "@/hooks/useSPEPagination";
import useSPETranslation from "@/hooks/useSPETranslation";
import { fetchCopyTransactions } from "@/services/apis";
import {
  NoDataRecord,
  SPEPagination,
  SPETableDateTime,
  SPETableHeader,
} from "@/ui/SPEMisc";
import { Box, Table, TableData, Text } from "@mantine/core";
import { useCallback, useMemo } from "react";

export default function MyTransactions() {
  const fetch = useCallback(
    (cursor: string, limit: number, reverse: boolean) => {
      return fetchCopyTransactions(cursor, limit, reverse);
    },
    [],
  );

  const {
    data: transactions,
    havePreviousPage,
    haveNextPage,
    goPrev,
    goNext,
  } = useSPEPagination(fetch);
  const t = useSPETranslation();

  const tableData: TableData = useMemo(
    () => ({
      head: ["Time", "Trader", "Type", "Amount (USDT)", "In/Out"].map(
        (label, idx) => <SPETableHeader key={idx} label={label} />,
      ),
      body: transactions.map((transaction) => [
        <>
          <Text hiddenFrom="sm" c={"dimmed"}>
            {t("Time")}
          </Text>
          <SPETableDateTime
            key={`${transaction.id}.time`}
            time={transaction.createdAt}
          />
        </>,
      ]),
    }),
    [transactions, t],
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
