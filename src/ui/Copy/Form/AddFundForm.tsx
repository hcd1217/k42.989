import BN from "@/common/big-number";
import { AccountType } from "@/common/enums";
import { buildOptions } from "@/common/utils";
import useSPETranslation from "@/hooks/useSPETranslation";
import { addCopyFundApi } from "@/services/apis";
import { assetStore } from "@/store/assets";
import NumberFormat from "@/ui/NumberFormat";
import { error, success } from "@/utils/notifications";
import { reloadWindow } from "@/utils/utility";
import {
  Box,
  Button,
  Flex,
  InputLabel,
  NumberInput,
  Select,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconChevronDown } from "@tabler/icons-react";
import { useMemo, useState } from "react";

export function AddFundForm({
  masterAccountId,
}: {
  masterAccountId: string;
}) {
  const t = useSPETranslation();
  const { accounts, balances } = assetStore();
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

  const available = useMemo(() => {
    const balance = balances.find((el) => {
      if (el.accountId === form.accountId) {
        return el.coin === "USDT";
      }
      return false;
    });
    return Number(BN.sub(balance?.amount || 0, balance?.locked || 0));
  }, [balances, form.accountId]);

  return (
    <Box className="space-y-10">
      <InputLabel fw={600} fz={14}>
        {t("Amount")}
      </InputLabel>
      <NumberInput
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
                setForm((prev) => ({ ...prev, amount: available }))
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
      <Flex justify="space-between" gap={10}>
        <InputLabel fw={600} fz={14}>
          {t("Available")}
        </InputLabel>
        <NumberFormat value={available} />
      </Flex>
      <Box w={"100%"}>
        <Button
          mt={5}
          fullWidth
          disabled={form.amount === 0}
          onClick={() => {
            addCopyFundApi(
              masterAccountId,
              form.accountId,
              form.amount,
            )
              .then(() => {
                success(t("Success"), t("Fund added successfully"));
              })
              .catch(() => {
                error(
                  t("Something went wrong"),
                  t("Cannot add fund"),
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
