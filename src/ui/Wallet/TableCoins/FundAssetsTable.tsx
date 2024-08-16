import BN from "@/common/big-number";
import { ASSET_COIN_LIST } from "@/common/configs";
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
import {
  DepositForm,
  SwapForm,
  TransferForm,
  WithdrawForm,
} from "../Form";

type ModalMode =
  | "DEPOSIT"
  | "SWAP"
  | "TRANSFER"
  | "WITHDRAW"
  | "ADDRESS";

export function FundAssetsTable({ hideZero }: { hideZero: boolean }) {
  const t = useSPETranslation();
  const { accounts, balances, fundingAccount, tradingAccount } =
    assetStore();
  const [modalMode, setModalMode] = useState<ModalMode>();
  const [coin, setCoin] = useState("");
  const [opened, { open, close }] = useDisclosure(false);

  const openModal = useCallback(
    (mode: ModalMode, coin: string) => {
      setModalMode(mode);
      setCoin(coin);
      open();
    },
    [open],
  );

  const tableData: TableData = useMemo(() => {
    const accountId = accounts.find((el) => el.isFunding)?.id;
    const rows = balances.filter((el) => {
      if (accountId && el.accountId === accountId) {
        return hideZero ? BN.gt(el.amount, 0) : true;
      }
      return false;
    });
    return {
      head: ["Coin", "Available", "Frozen", "BTC", "Actions"].map(
        (el) => t(el),
      ),
      body: rows.map((row) => [
        <>
          {/* <Text hiddenFrom="sm" c={"dimmed"}>
            {t("Coin")}
          </Text> */}
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
            {t("Available")}
          </Text>
          <Title order={6}>
            <NumberFormat decimalPlaces={8} value={row.amount} />
          </Title>
          <Text c="dimmed" size="xs">
            ~ $
            {<NumberFormat decimalPlaces={3} value={row.usdValue} />}
          </Text>
        </>,
        <>
          <Text hiddenFrom="sm" c={"dimmed"}>
            {t("Frozen")}
          </Text>
          <Title order={6}>
            {
              <NumberFormat
                decimalPlaces={8}
                value={row.locked || 0}
              />
            }
          </Title>
          <Text c="dimmed" size="xs">
            ~ $
            {
              <NumberFormat
                decimalPlaces={3}
                value={row.lockedUsdValue || 0}
              />
            }
          </Text>
        </>,
        <>
          <Text hiddenFrom="sm" c={"dimmed"}>
            {t("BTC Valuation")}
          </Text>
          <Title order={6}>
            {row.btcValue}
            {
              <NumberFormat
                decimalPlaces={8}
                value={row.btcValue || 0}
              />
            }
          </Title>
        </>,
        <>
          <Text hiddenFrom="sm" c={"dimmed"}>
            {t("Actions")}
          </Text>
          <Flex gap={8}>
            <Button
              onClick={() => openModal("DEPOSIT", row.coin)}
              p={0}
              size="xs"
              variant="transparent"
            >
              {t("Deposit")}
            </Button>
            <Button
              onClick={() => openModal("SWAP", row.coin)}
              p={0}
              size="xs"
              variant="transparent"
            >
              {t("Swap")}
            </Button>
            <Button
              disabled
              onClick={() => openModal("WITHDRAW", row.coin)}
              p={0}
              size="xs"
              variant="transparent"
            >
              {t("Withdraw")}
            </Button>
            {/* <Button p={0} size="xs" variant="transparent">
              {t("Address")} // TODO: Implement this
            </Button> */}
            <Button
              onClick={() => openModal("TRANSFER", row.coin)}
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
      <Box h={"100%"}>
        <Table.ScrollContainer minWidth={"100%"} h={"100%"}>
          <Table
            data={tableData}
            stickyHeader
            highlightOnHover
            classNames={{
              table: "table-sticky-column table-list-gird-view",
            }}
            styles={{
              th: {
                whiteSpace: "nowrap",
                fontSize: "12px",
              },
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
        scrollAreaComponent={ScrollArea.Autosize}
        styles={{
          content: {
            background: "none",
            boxShadow: "none",
          },
        }}
      >
        <Box pos={"relative"}>
          {modalMode !== "DEPOSIT" && (
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
          )}
          {modalMode == "DEPOSIT" && (
            <DepositForm maw={"100%"} coin={coin} onClose={close} />
          )}
          {modalMode == "SWAP" && (
            <SwapForm coin={coin} onSubmit={onSubmit} />
          )}
          {modalMode == "TRANSFER" && (
            <TransferForm
              coin={coin}
              accountIds={[
                fundingAccount?.id || "",
                tradingAccount?.id || "",
              ]}
              onSubmit={onSubmit}
            />
          )}
          {modalMode == "WITHDRAW" && (
            <WithdrawForm coin={coin} onSubmit={onSubmit} />
          )}
        </Box>
      </Modal>
    </>
  );
}
