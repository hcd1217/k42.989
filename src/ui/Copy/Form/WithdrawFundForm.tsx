import { AccountType } from "@/common/enums";
import { buildOptions } from "@/common/utils";
import useSPETranslation from "@/hooks/useSPETranslation";
import {
  fetchCopyOpenPositions,
  withdrawCopyFundApi,
} from "@/services/apis";
import { assetStore } from "@/store/assets";
import { CopyPosition } from "@/types";
import NumberFormat from "@/ui/NumberFormat";
import { error, success } from "@/utils/notifications";
import { reloadWindow } from "@/utils/utility";
import {
  Box,
  Button,
  Card,
  Flex,
  InputLabel,
  NumberInput,
  Select,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconChevronDown } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import PositionBox from "./PositionBox";

export function WithdrawFundForm({
  masterAccountId,
  following = true,
  withdrawable,
}: {
  withdrawable: number;
  following?: boolean;
  masterAccountId: string;
}) {
  const t = useSPETranslation();
  const { accounts } = assetStore();
  const [positions, setPositions] = useState<CopyPosition[]>([]);
  const options = useMemo(() => {
    return buildOptions(
      accounts.filter((el) => el.type === AccountType.MAIN),
      "name",
      "id",
    );
  }, [accounts]);
  const [form, setForm] = useState({
    amount: 0,
    accountId: options[0]?.value || "",
  });

  useEffect(() => {
    if (withdrawable === 0) {
      fetchCopyOpenPositions(masterAccountId).then((positions) =>
        setPositions(positions),
      );
    }
  }, [masterAccountId, withdrawable]);

  return (
    <Box className="space-y-10">
      {following ? (
        <Text c={"red"} fz={12} mb={5} fw="bold">
          {t("Please un-follow the trader before withdrawing funds.")}
        </Text>
      ) : (
        <></>
      )}
      <InputLabel fw={600} fz={14}>
        {t("Amount")}
      </InputLabel>
      <NumberInput
        disabled={withdrawable === 0}
        thousandSeparator
        size="sm"
        value={form.amount || ""}
        onChange={(v) =>
          setForm((prev) => ({ ...prev, amount: Number(v) }))
        }
        rightSection={
          <Flex
            gap={10}
            pr={"sm"}
            align={"center"}
            justify={"end"}
            w={"100%"}
          >
            <Text>USDT</Text>
            <Button
              fz={16}
              onClick={() =>
                setForm((prev) => ({ ...prev, amount: withdrawable }))
              }
              p={0}
              variant="transparent"
              color="primary"
            >
              {t("All")}
            </Button>
          </Flex>
        }
        rightSectionWidth={100}
      />
      <Select
        size="sm"
        styles={{
          label: {
            fontWeight: 600,
            fontSize: "14px",
          },
        }}
        onChange={(v) => {
          setForm((prev) => ({ ...prev, accountId: v || "" }));
        }}
        label={t("Select Account")}
        value={form.accountId}
        data={options}
        rightSection={<IconChevronDown />}
      />
      {positions.length === 0 ? (
        <Flex justify="space-between" gap={10} fw="bold">
          <InputLabel fw={600} fz={14}>
            {t("Withdrawable")}
          </InputLabel>
          <NumberFormat value={withdrawable} prefix="USDT " />
        </Flex>
      ) : (
        <Box>
          <InputLabel fw={600} fz={14}>
            {t("Current Position")}
          </InputLabel>
          <Card bg="gray.2" p={"lg"}>
            {positions.map((position) => (
              <PositionBox
                position={position}
                key={position.positionId}
              />
            ))}
          </Card>
        </Box>
      )}
      <Box>
        <Button
          mt={5}
          fullWidth
          disabled={form.amount === 0}
          onClick={() => {
            withdrawCopyFundApi(
              masterAccountId,
              form.accountId,
              form.amount,
            )
              .then(() => {
                success(
                  t("Success"),
                  t("Fund withdraw successfully"),
                );
              })
              .catch(() => {
                error(
                  t("Something went wrong"),
                  t("Cannot withdraw fund"),
                );
              })
              .finally(() => {
                modals.closeAll();
                reloadWindow();
              });
          }}
        >
          {t("Confirm")}
        </Button>
      </Box>
    </Box>
  );
}
