import BN from "@/common/big-number";
import { MODAL_STYLES } from "@/domain/config";
import useSPETranslation from "@/hooks/useSPETranslation";
import { assetStore } from "@/store/assets";
import AppButton from "@/ui/Button/AppButton";
import {
  AddFundForm,
  CopySettingForm,
  MasterTrader,
  UnFollowForm,
  WithdrawFundForm,
} from "@/ui/Copy";
import {
  NoDataRecord,
  SPETableHeader,
  SPETableNumber,
} from "@/ui/SPEMisc";
import { valueColor } from "@/utils/utility";
import { Box, Flex, Table, TableData, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconLogout,
  IconPlus,
  IconSettings,
  IconX,
} from "@tabler/icons-react";
import { useMemo } from "react";

export default function MyTraders() {
  const t = useSPETranslation();
  const { masterTraders: traders } = assetStore();

  const tableData: TableData = useMemo(() => {
    return {
      head: [
        "My Traders",
        "Copy Ratio",
        "Assets (USDT)",
        "NetPnL (USDT)",
        "Position",
        "Investment",
        "Withdrawable",
        "Actions",
      ].map((label, idx) => (
        <SPETableHeader key={idx} label={label} />
      )),
      body: traders
        .filter((trader) => {
          if (trader.asset !== 0 || trader.ratio !== 0) {
            return true;
          }
          return false;
        })
        .map((trader) => [
          <>
            <MasterTrader
              key={`${trader.masterAccountId}.avatar`}
              avatar={trader.avatar}
              name={trader.name}
            />
          </>,
          <>
            <Text hiddenFrom="sm" c={"dimmed"}>
              {t("Ratio")}
            </Text>
            <SPETableNumber
              decimalPlaces={0}
              value={Number(trader.ratio)}
              suffix={trader.ratio ? "%" : undefined}
              key={`${trader.masterAccountId}.ratio`}
            />
          </>,
          <>
            <Text hiddenFrom="sm" c={"dimmed"}>
              {t("Assets (USDT)")}
            </Text>
            <SPETableNumber
              decimalPlaces={2}
              key={`${trader.masterAccountId}.asset`}
              value={trader.asset}
            />
          </>,
          <>
            <Text hiddenFrom="sm" c={"dimmed"}>
              {t("NetPnL (USDT)")}
            </Text>
            <SPETableNumber
              withSign
              decimalPlaces={2}
              color={valueColor(trader.netPnL)}
              key={`${trader.masterAccountId}.netPnL`}
              value={trader.netPnL}
            />
          </>,
          <>
            <Text hiddenFrom="sm" c={"dimmed"}>
              {t("Positions")}
            </Text>
            <SPETableNumber
              withSign
              decimalPlaces={3}
              color={valueColor(trader.currentPosition || 0)}
              key={`${trader.masterAccountId}.currentPosition`}
              value={trader.currentPosition}
            />
          </>,
          <>
            <Text hiddenFrom="sm" c={"dimmed"}>
              {t("Investment")}
            </Text>
            <SPETableNumber
              decimalPlaces={2}
              key={`${trader.masterAccountId}.invested`}
              value={BN.sub(trader.invested, trader.withdraw)}
            />
          </>,
          <>
            <Text hiddenFrom="sm" c={"dimmed"}>
              {t("Withdrawable")}
            </Text>
            <SPETableNumber
              color={"dimmed"}
              decimalPlaces={2}
              key={`${trader.masterAccountId}.withDrawable`}
              value={trader.ratio > 0 ? 0 : trader.asset}
            />
          </>,
          <>
            <Text hiddenFrom="sm" c={"dimmed"}>
              {t("Actions")}
            </Text>
            <Flex
              key={`${trader.masterAccountId}.actions`}
              justify="start"
              align="center"
            >
              <AppButton
                disabled={trader.paused || trader.ratio === 0}
                instancetype="Default"
                variant="transparent"
                onClick={() => {
                  modals.open({
                    ...MODAL_STYLES,
                    title: t("Add fund"),
                    children: (
                      <AddFundForm
                        masterAccountId={trader.masterAccountId}
                      />
                    ),
                  });
                }}
              >
                <IconPlus />
              </AppButton>
              <AppButton
                instancetype="Default"
                variant="transparent"
                disabled={trader.ratio > 0}
                onClick={() => {
                  modals.open({
                    ...MODAL_STYLES,
                    title: t("Withdraw fund"),
                    children: (
                      <WithdrawFundForm
                        withdrawable={trader.asset}
                        masterAccountId={trader.masterAccountId}
                      />
                    ),
                  });
                }}
              >
                <IconLogout />
              </AppButton>
              <AppButton
                instancetype="Default"
                variant="transparent"
                onClick={() => {
                  modals.open({
                    ...MODAL_STYLES,
                    title: t("Copy settings"),
                    children: (
                      <CopySettingForm
                        masterAccountId={trader.masterAccountId}
                      />
                    ),
                  });
                }}
              >
                <IconSettings />
              </AppButton>
              <AppButton
                disabled={trader.ratio === 0}
                instancetype="Default"
                variant="transparent"
                onClick={() => {
                  modals.open({
                    ...MODAL_STYLES,
                    title: t("Un-follow %s", trader.name),
                    children: (
                      <UnFollowForm
                        masterAccountId={trader.masterAccountId}
                        name={trader.name}
                      />
                    ),
                  });
                }}
              >
                <IconX />
              </AppButton>
            </Flex>
          </>,
        ]),
    };
  }, [t, traders]);

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
