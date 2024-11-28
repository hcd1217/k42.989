import BN from "@/common/big-number";
import { STATUS_COLORS } from "@/common/configs";
import { TransactionType } from "@/common/enums";
import { getExplorerUrl } from "@/common/transaction";
import useSPEPagination from "@/hooks/useSPEPagination";
import useSPETranslation from "@/hooks/useSPETranslation";
import { fetchTransactions } from "@/services/apis";
import { Asset } from "@/ui/Asset/Asset";
import NumberFormat from "@/ui/NumberFormat";
import { NoDataRecord, SPEPagination } from "@/ui/SPEMisc";
import { fmtDate } from "@/utils/utility";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Flex,
  Modal,
  ScrollArea,
  Table,
  TableData,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import { WithdrawForm } from "../Form";
import { Address } from "./Common";

export function WithdrawRecords() {
  const t = useSPETranslation();
  const [opened, { open, close }] = useDisclosure(false);
  const [coin, setCoin] = useState("");
  const openModal = useCallback(
    (coin: string) => {
      setCoin(coin);
      open();
    },
    [open],
  );

  const fetch = useCallback(
    (cursor: string, limit: number, reverse: boolean) => {
      return fetchTransactions(
        TransactionType.WITHDRAW,
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

  const tableData: TableData = useMemo(
    () => ({
      head: [
        "Time",
        "Coin",
        "Amount",
        "Withdraw Fee",
        "Withdraw Address",
        "Status",
        "Remark",
        "Actions",
      ].map((el) => t(el)),
      body: transactions.map((row) => {
        const explorerUrl = getExplorerUrl(row.txId);
        return [
          <>
            <Text hiddenFrom="sm" c={"dimmed"}>
              {t("Time")}
            </Text>
            <Title order={6} fz={12} key={`${row.id}.time`}>
              {fmtDate(row.updatedAt)}
            </Title>
          </>,
          <>
            <Asset asset={row.asset} key={`${row.id}.asset`} />
          </>,
          <>
            <Text hiddenFrom="sm" c={"dimmed"}>
              {t("Amount")}
            </Text>
            <Title order={6} fz={12} key={`${row.id}.amount`}>
              <NumberFormat
                decimalPlaces={3}
                value={BN.sub(row.amount, row.fee)}
              />
            </Title>
          </>,
          <>
            <Text hiddenFrom="sm" c={"dimmed"}>
              {t("Withdraw Fee")}
            </Text>
            <Title order={6} fz={12} key={`${row.id}.fee`}>
              <NumberFormat decimalPlaces={3} value={row.fee} />
            </Title>
          </>,
          <Address
            key={`${row.id}.to`}
            t={t}
            explorerUrl={explorerUrl}
            address={row.to}
          />,
          <>
            <Text hiddenFrom="sm" c={"dimmed"}>
              {t("Status")}
            </Text>
            <Badge
              color={STATUS_COLORS[row.status]}
              key={`${row.id}.status`}
            >
              {row.status}
            </Badge>
          </>,
          <>
            <Text hiddenFrom="sm" c={"dimmed"}>
              {t("Remark")}
            </Text>
            <Title order={6} key={`${row.id}.remark`}>
              --
            </Title>
          </>,
          <>
            <Flex gap={5} key={`${row.id}.action`}>
              <Button
                onClick={() => openModal(row.asset)}
                p={0}
                size="xs"
                variant="transparent"
              >
                {t("Withdraw")}
              </Button>
            </Flex>
          </>,
        ];
      }),
    }),
    [openModal, t, transactions],
  );

  return (
    <>
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
      <Modal
        centered
        variant="transparent"
        opened={opened}
        onClose={close}
        w={600}
        withCloseButton={false}
        size={"600px"}
        shadow="none"
        styles={{
          content: {
            background: "none",
            boxShadow: "none",
          },
        }}
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <Box pos={"relative"}>
          <ActionIcon
            onClick={close}
            radius={"xl"}
            variant="transparent"
            pos={"absolute"}
            right={30}
            top={30}
            styles={{
              root: {
                zIndex: 2,
              },
            }}
          >
            <IconX color="gray" />
          </ActionIcon>
          <WithdrawForm coin={coin} onSubmit={close} />
        </Box>
      </Modal>
    </>
  );
}
