import useSPEPagination from "@/hooks/useSPEPagination";
import useSPETranslation from "@/hooks/useSPETranslation";
import { fetchCopyTransactions } from "@/services/apis";
import {
  NoDataRecord,
  SPEPagination,
  SPETableDateTime,
  SPETableHeader,
  SPETableNumber,
  SPETableText,
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
      head: ["Time", "Master Trader", "Type", "Amount (USDT)"].map(
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
        <>
          <Text hiddenFrom="sm" c={"Master"}>
            {t("Master Account")}
          </Text>
          <SPETableText
            key={`${transaction.id}.Master`}
            value={transaction.copyMaster || ""}
          />
        </>,
        <>
          <Text hiddenFrom="sm" c={"Master"}>
            {t("Type")}
          </Text>
          <SPETableText
            key={`${transaction.id}.Type`}
            value={transaction.type || ""}
          />
        </>,
        <>
          <Text hiddenFrom="sm" c={"Master"}>
            {t("Amount")}
          </Text>
          <SPETableNumber
            withSign
            color={transaction.amount > 0 ? "green" : "red"}
            key={`${transaction.id}.amount`}
            value={transaction.amount || "-"}
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
