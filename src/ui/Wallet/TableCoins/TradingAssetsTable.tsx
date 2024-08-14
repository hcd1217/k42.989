import BN from "@/common/big-number";
import { ASSET_COIN_LIST } from "@/common/configs";
import { AccountType } from "@/common/enums";
import { COIN_IMAGES } from "@/domain/config";
import useSPETranslation from "@/hooks/useSPETranslation";
import { assetStore } from "@/store/assets";
import NumberFormat from "@/ui/NumberFormat";
import { NoDataRecord } from "@/ui/SPEMisc";
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Image,
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
import { TransferForm } from "../Form";

export function TradingAssetsTable({
  hideZero,
  defaultTransferType = "transferOut",
}: {
  hideZero: boolean;
  defaultTransferType?: "transferIn" | "transferOut";
}) {
  const t = useSPETranslation();
  const [opened, { open, close }] = useDisclosure(false);
  const [coin, setCoin] = useState("");
  const { accounts, balances, fundingAccount, tradingAccount } =
    assetStore();

  const openModal = useCallback(
    (coin: string) => {
      setCoin(coin);
      open();
    },
    [open],
  );

  const tableData: TableData = useMemo(() => {
    const accountId = accounts.find(
      (el) => !el.isFunding && el.type === AccountType.MAIN,
    )?.id;
    const rows = balances.filter((el) => {
      if (accountId && el.accountId === accountId) {
        return hideZero ? BN.gt(el.amount, 0) : true;
      }
      return false;
    });
    return {
      head: [
        "Coin",
        "Assets",
        "Total Equity",
        "Available Margin",
        "Position Margin",
        "Unrealized PnL",
        "Actions",
      ].map((el) => t(el)),
      body: rows.map((row) => [
        <>
          <Flex align={"center"} gap={10}>
            <Box>
              <Image w={30} h={30} src={COIN_IMAGES[row.coin]} />
            </Box>
            <Box>
              <Title order={6}>{row.coin}</Title>
              <Text c="dimmed">{ASSET_COIN_LIST[row.coin]}</Text>
            </Box>
          </Flex>
        </>,
        <>
          <Text hiddenFrom="sm" c={"dimmed"}>
            {t("Assets")}
          </Text>
          <Title order={6}>
            <NumberFormat decimalPlaces={8} value={row.amount} />
          </Title>
          <Text c="dimmed" size="xs">
            ~ $
            <NumberFormat decimalPlaces={3} value={row.usdValue} />
          </Text>
        </>,
        <>
          <Text hiddenFrom="sm" c={"dimmed"}>
            {t("Total Equity")}
          </Text>
          <Title order={6}>
            <NumberFormat decimalPlaces={8} value={row.equity} />
          </Title>
        </>,
        <>
          <Text hiddenFrom="sm" c={"dimmed"}>
            {t("Available Margin")}
          </Text>
          <Title order={6}>
            <NumberFormat
              decimalPlaces={8}
              value={row.availableMargin}
            />
          </Title>
        </>,
        <>
          <Text hiddenFrom="sm" c={"dimmed"}>
            {t("Position Margin")}
          </Text>
          <Title order={6}>
            <NumberFormat decimalPlaces={8} value={row.margin} />
          </Title>
        </>,
        <>
          <Text hiddenFrom="sm" c={"dimmed"}>
            {t("Unrealized PnL")}
          </Text>
          <Title order={6}>
            <NumberFormat
              decimalPlaces={8}
              value={row.unRealizedPnl}
            />
          </Title>
        </>,
        <>
          <Text hiddenFrom="sm" c={"dimmed"}>
            {t("Actions")}
          </Text>
          <Flex gap={5}>
            <Button
              onClick={() => openModal(row.coin)}
              p={0}
              size="xs"
              variant="transparent"
            >
              {t("Transfer")}
            </Button>
          </Flex>
        </>,
      ]),
    };
  }, [accounts, balances, hideZero, openModal, t]);

  const onSubmit = useCallback(() => {
    assetStore.getState().fetchBalances();
    close();
  }, [close]);

  return (
    <>
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
          {tableData.body?.length === 0 && <NoDataRecord />}
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
          body: {
            // border: "solid 1px red",
          },
          root: {
            // border: "solid 1px blue",
          },
          content: {
            // border: "solid 1px orange",
            background: "none",
            boxShadow: "none",
            // overflow: "hidden"
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
          <TransferForm
            coin={coin}
            accountIds={
              defaultTransferType === "transferIn"
                ? [fundingAccount?.id || "", tradingAccount?.id || ""]
                : [tradingAccount?.id || "", fundingAccount?.id || ""]
            }
            onSubmit={onSubmit}
          />
        </Box>
      </Modal>
    </>
  );
}
