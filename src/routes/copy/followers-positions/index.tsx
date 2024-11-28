import { ROWS_PER_PAGE } from "@/common/configs";
import { MODAL_STYLES } from "@/domain/config";
import useSPESyncData from "@/hooks/useSPESyncData";
import useSPETranslation from "@/hooks/useSPETranslation";
import {
  fetchFollowerInformation,
  remarkFollowerApi,
} from "@/services/apis";
import { FollowerInformation } from "@/types";
import AppButton from "@/ui/Button/AppButton";
import { RemoveFollowerForm } from "@/ui/Copy";
import {
  NoDataRecord,
  SPETableDateTime,
  SPETableDoubleNumbers,
  SPETableHeader,
  SPETableNumber,
  SPETableText,
} from "@/ui/SPEMisc";
import AppText from "@/ui/Text/AppText";
import { error, success } from "@/utils/notifications";
import {
  Box,
  Flex,
  Pagination,
  Table,
  TableData,
  TextInput,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconDeviceFloppy, IconUserX } from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";

export default function FollowerPositions() {
  const t = useSPETranslation();
  const fetch = useCallback(() => fetchFollowerInformation(), []);
  const followers = useSPESyncData<FollowerInformation[]>(fetch);
  const total = useMemo(
    () => 1 + Math.floor((followers?.length || 0) / ROWS_PER_PAGE),
    [followers],
  );
  const [page, setPage] = useState(1);
  const tableData: TableData = useMemo(() => {
    return {
      head: [
        "Time",
        "Follower UID",
        "Positions",
        ["Investment (USDT)", "Current Assets (USDT)"],
        ["Settled Profit Sharing", "Unsettled Profit Sharing"],
        ["Realized PnL (USDT)", "Unrealized PnL (USDT)"],
        "Remark",
        "Actions",
      ].map((label, idx) => (
        <SPETableHeader key={idx} label={label} />
      )),
      body: (followers || [])
        .slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)
        .map((follower, idx) => {
          return [
            <SPETableDateTime
              key={`${idx}.followFrom`}
              time={follower.followFrom}
            />,
            <SPETableText key={`${idx}.uid`} value={follower.uid} />,
            <Box key={`${idx}.positions`}>
              {Object.keys(follower.positions || {}).length ? (
                <></>
              ) : (
                <AppText>-</AppText>
              )}
              {Object.entries(follower.positions || []).map(
                ([symbol, position]) => (
                  <FollowerPosition
                    key={symbol}
                    color={position > 0 ? "green" : "red"}
                    symbol={symbol}
                    position={position}
                  />
                ),
              )}
            </Box>,
            <SPETableDoubleNumbers
              maw={200}
              key={`${idx}.asset`}
              values={[follower.invested || 0, follower.current || 0]}
            />,
            <SPETableDoubleNumbers
              maw={200}
              key={`${idx}.profit`}
              values={[
                follower.settled || 0,
                follower.unSettled || 0,
              ]}
            />,
            <SPETableDoubleNumbers
              maw={200}
              key={`${idx}.pnl`}
              decimalPlaces={2}
              values={[
                follower.realizedPnl || 0,
                follower.unrealizedPnl || 0,
              ]}
            />,
            <Remark
              key={`${idx}.remark`}
              accountId={follower.accountId}
              remark={follower.remark || ""}
            />,
            <AppButton
              key={`${idx}.action`}
              instancetype="Default"
              variant="transparent"
              onClick={() => {
                modals.open({
                  ...MODAL_STYLES,
                  title: t("Remove follower"),
                  children: (
                    <RemoveFollowerForm
                      uid={follower.uid}
                      accountId={follower.accountId}
                    />
                  ),
                });
              }}
            >
              <IconUserX />
            </AppButton>,
          ];
        }),
    };
  }, [page, followers, t]);

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
        {total > 1 && (
          <Flex justify={"center"} mt={20}>
            <Pagination
              withEdges
              value={page}
              total={total}
              onChange={setPage}
            />
          </Flex>
        )}
      </Table.ScrollContainer>
    </Box>
  );
}

function Remark({
  accountId,
  remark,
}: {
  remark: string;
  accountId: string;
}) {
  const t = useSPETranslation();
  const [value, setValue] = useState(remark || "");

  return (
    <TextInput
      size="sm"
      value={value}
      onChange={(e) => {
        setValue(e.target.value || "");
      }}
      rightSection={
        <IconDeviceFloppy
          size={16}
          color="#f18f14"
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            remarkFollowerApi(accountId, value)
              .then(() => {
                success(t("Success"), t("Remark updated"));
              })
              .catch(() => {
                error(
                  t("Something went wrong"),
                  t("Cannot add remark"),
                );
              });
          }}
        />
      }
    />
  );
}

function FollowerPosition({
  symbol,
  color,
  position,
}: {
  symbol: string;
  color: string;
  position: number;
}) {
  return (
    <Flex key={symbol} gap={3} align="center">
      <SPETableText color={color} value={symbol} />
      <SPETableNumber
        color={color}
        prefix={Number(position) > 0 ? "+" : ""}
        value={position}
      />
    </Flex>
  );
}
