import useSPEPagination from "@/hooks/useSPEPagination";
import { fetchCopyTransactions } from "@/services/apis";
import {
  NoDataRecord,
  SPEPagination,
  SPETableDateTime,
  SPETableHeader,
  SPETableNumber,
  SPETableText,
} from "@/ui/SPEMisc";
import { Box, Table, TableData } from "@mantine/core";
import { useCallback, useMemo } from "react";

export default function MasterTransactions() {
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

  const tableData: TableData = useMemo(
    () => ({
      head: [
        "Time",
        "Type",
        "Amount (USDT)",
        "Follower UID",
        "Remark",
      ].map((label, idx) => (
        <SPETableHeader key={idx} label={label} />
      )),
      body: transactions.map((transaction) => [
        <SPETableDateTime
          key={`${transaction.id}.time`}
          time={transaction.createdAt}
        />,
        <SPETableText
          key={`${transaction.id}.type`}
          value={transaction.type || "-"}
        />,
        <SPETableNumber
          key={`${transaction.id}.amount`}
          value={transaction.amount || "-"}
        />,
        <SPETableText
          key={`${transaction.id}.uid`}
          value={transaction.uid || "-"}
        />,
        <SPETableText
          key={`${transaction.id}.remark`}
          value={transaction.remark || "-"}
        />,
      ]),
    }),
    [transactions],
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
