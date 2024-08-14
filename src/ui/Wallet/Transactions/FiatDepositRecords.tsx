import { STATUS_COLORS } from "@/common/configs";
import { TransactionType } from "@/common/enums";
import useSPEPagination from "@/hooks/useSPEPagination";
import useSPETranslation from "@/hooks/useSPETranslation";
import { fetchTransactions } from "@/services/apis";
import { Asset } from "@/ui/Asset/Asset";
import NumberFormat from "@/ui/NumberFormat";
import { NoDataRecord, SPEPagination } from "@/ui/SPEMisc";
import { fmtDate } from "@/utils/utility";
import {
  Badge,
  Box,
  Table,
  TableData,
  Text,
  Title,
} from "@mantine/core";
import { useCallback, useMemo } from "react";

export function FiatDepositRecords() {
  const t = useSPETranslation();

  const fetch = useCallback(
    (cursor: string, limit: number, reverse: boolean) => {
      return fetchTransactions(
        TransactionType.DEPOSIT,
        limit,
        cursor,
        reverse,
      );
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

  const tableData: TableData = useMemo(() => {
    return {
      head: [
        "Coin",
        "Time",
        "JPY Amount",
        "USDT Amount",
        "Status",
      ].map((el) => t(el)),
      body: transactions
        .filter((el) => el.type === TransactionType.FIAT_DEPOSIT)
        .map((row) => [
          <>
            <Asset asset={row.asset} />
          </>,
          <>
            <Text hiddenFrom="sm" c={"dimmed"}>
              {t("Time")}
            </Text>
            <Title order={6} fz={12}>
              {fmtDate(row.updatedAt)}
            </Title>
          </>,
          <>
            <Text hiddenFrom="sm" c={"dimmed"}>
              {t("JPY Amount")}
            </Text>
            <Title order={6} fz={12}>
              <NumberFormat decimalPlaces={8} value={row.jpyAmount} />
            </Title>
          </>,
          <>
            <Text hiddenFrom="sm" c={"dimmed"}>
              {t("USDT Amount")}
            </Text>
            <Title order={6} fz={12}>
              <NumberFormat decimalPlaces={8} value={row.amount} />
            </Title>
          </>,
          <>
            <Text hiddenFrom="sm" c={"dimmed"}>
              {t("Status")}
            </Text>
            <Badge color={STATUS_COLORS[row.status]}>
              {row.status}
            </Badge>
          </>,
        ]),
    };
  }, [t, transactions]);

  return (
    <Box h={"100%"} w={"100%"}>
      <Table.ScrollContainer minWidth={"100%"} h={"100%"}>
        <Table
          data={tableData}
          stickyHeader
          highlightOnHover
          verticalSpacing={"xs"}
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
        <>{transactions.length === 0 && <NoDataRecord />}</>
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
