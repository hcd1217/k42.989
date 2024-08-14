import bigNumber from "@/common/big-number";
import { CopySetting } from "@/common/types";
import useSPETranslation from "@/hooks/useSPETranslation";
import {
  fetchCopySetting,
  followApi,
  saveCopySetting,
} from "@/services/apis";
import { assetStore } from "@/store/assets";
import { error, success } from "@/utils/notifications";
import { reloadWindow } from "@/utils/utility";
import {
  Alert,
  Box,
  Button,
  Flex,
  InputLabel,
  LoadingOverlay,
  NumberInput,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { useEffect, useMemo, useState } from "react";

export function CopySettingForm({
  masterAccountId,
}: {
  masterAccountId: string;
}) {
  const t = useSPETranslation();
  const [newFollower, setNewFollower] = useState(false);
  const [form, setForm] = useState<CopySetting>();
  const [followAmount, setFollowAmount] = useState(0);
  const [fetching, setFetching] = useState(true);
  const { fundingBalances } = assetStore();
  const maxAmountUSDT = useMemo(() => {
    const amount = fundingBalances.find(v => v.coin === "USDT")?.amount;
    return parseFloat(amount ?? "0");
  }, [fundingBalances]);

  useEffect(() => {
    setFetching(true);
    fetchCopySetting(masterAccountId).then((form) => {
      setNewFollower(!form);
      setForm(
        form || {
          masterAccountId,
          ratio: 0,
          maxAmount: 0,
          minAmount: 0,
          maxMarginPerMonth: 0,
          tpRatio: 0,
          slRatio: 0,
        },
      );
    }).finally(() => setFetching(false));
  }, [masterAccountId]);
  if(fetching) {
    return <LoadingOverlay visible={fetching} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />;
  }
  if (newFollower) {
    return (
      <Box className="space-y-10" mih={150}>
        <InputLabel fw={600} fz={14}>
          {t("Copy Trade Ratio (%)")}
        </InputLabel>
        <NumberInput
          hideControls
          size="sm"
          value={form?.ratio || 20}
          description={t("Enter a percentage from 20% to 100%")}
          step={1}
          min={20}
          max={100}
          onChange={(v) =>
            setForm(_save(form, "ratio", Math.round(Number(v))))
          }
        />
        <InputLabel fw={600} fz={14}>
          {t("Follow amount (USDT)")}
        </InputLabel>
        <NumberInput
          rightSection={<></>}
          thousandSeparator
          size="sm"
          value={followAmount}
          max={maxAmountUSDT}
          min={1}
          disabled={maxAmountUSDT <= 0}
          step={1}
          onChange={(v) => setFollowAmount(Math.round(Number(v)))}
        />
        {maxAmountUSDT <= 0 && <Alert>
          {t("Your amount is insufficient to proceed with this step. Please deposit more funds into your account to continue.")}
        </Alert>}
        <Box w={"100%"}>
          <Button
            mt={5}
            fullWidth
            disabled={!form}
            onClick={() => {
              form &&
                followApi(masterAccountId, form.ratio, followAmount)
                  .then(() => {
                    success(t("Success"), t("Follow success"));
                  })
                  .catch(() => {
                    error(
                      t("Something went wrong"),
                      t("Cannot update follow trader"),
                    );
                  })
                  .finally(() => {
                    modals.closeAll();
                    // reloadWindow();
                  });
            }}
          >
            {t("Follow")}
          </Button>
        </Box>
      </Box>
    );
  }
  return (
    <Box mih={150} className="space-y-10">
      <InputLabel fw={600} fz={14}>
        {t("Copy Trade Ratio (%)")}
      </InputLabel>
      <NumberInput
        hideControls
        size="sm"
        value={form?.ratio || 20}
        step={1}
        description={t("Enter a percentage from 20% to 100%")}
        min={20}
        max={100}
        onChange={(v) =>
          setForm(_save(form, "ratio", Math.round(Number(v))))
        }
      />
      <InputLabel fw={600} fz={14}>
        {t("Min./Max. Margin Per Order")}
      </InputLabel>
      <Flex align="center" justify="space-between">
        <NumberInput
          hideControls
          thousandSeparator
          size="sm"
          value={form?.maxAmount || 0}
          min={0}
          onChange={(v) =>
            setForm(_save(form, "maxAmount", Number(v)))
          }
        />
        <NumberInput
          rightSection={<></>}
          thousandSeparator
          size="sm"
          value={form?.minAmount || 0}
          min={0}
          onChange={(v) =>
            setForm(_save(form, "minAmount", Number(v)))
          }
        />
      </Flex>
      <InputLabel fw={600} fz={14}>
        {t("Max. Margin Per Month (%)")}
      </InputLabel>
      <NumberInput
        rightSection={<></>}
        thousandSeparator
        size="sm"
        value={form?.maxMarginPerMonth || 0}
        min={0}
        max={100}
        step={1}
        onChange={(v) =>
          setForm(_save(form, "maxMarginPerMonth", Number(v)))
        }
      />
      <InputLabel fw={600} fz={14}>
        {t("Take-Profit Ratio (%)")}
      </InputLabel>
      <NumberInput
        rightSection={<></>}
        thousandSeparator
        size="sm"
        value={form?.tpRatio || 0}
        min={0}
        max={100}
        step={1}
        onChange={(v) =>
          setForm(_save(form, "tpRatio", Math.round(Number(v))))
        }
      />
      <InputLabel fw={600} fz={14}>
        {t("Stop-Loss Ratio (%)")}
      </InputLabel>
      <NumberInput
        rightSection={<></>}
        thousandSeparator
        size="sm"
        value={form?.slRatio || 0}
        min={0}
        max={100}
        step={1}
        onChange={(v) =>
          setForm(_save(form, "slRatio", Math.round(Number(v))))
        }
      />
      <Box w={"100%"}>
        <Button
          mt={5}
          fullWidth
          disabled={!form}
          onClick={() => {
            form &&
              saveCopySetting(form)
                .then(() => {
                  success(t("Success"), t("Copy setting updated"));
                })
                .catch(() => {
                  error(
                    t("Something went wrong"),
                    t("Cannot update your copy setting"),
                  );
                })
                .finally(() => {
                  modals.closeAll();
                });
          }}
        >
          {t("Save")}
        </Button>
      </Box>
    </Box>
  );
}

function _save<T extends Record<string, unknown>>(
  form: T | undefined,
  key: string,
  value: unknown,
) {
  if (!form) {
    return undefined;
  }
  return {
    ...form,
    [key]: value,
  } as T;
}
