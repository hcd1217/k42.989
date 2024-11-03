import { useSPEForm } from "@/hooks/useSPEForm";
import useSPETranslation from "@/hooks/useSPETranslation";
import axios from "@/services/apis";
import { assetStore } from "@/store/assets";
import { SPEResponse } from "@/types";
import { error, success } from "@/utils/notifications";
import { numberValidate } from "@/utils/validates";
import {
  Box,
  Button,
  Card,
  Flex,
  InputError,
  LoadingOverlay,
  Select,
  Space,
  Stack,
  Text,
  Title,
  Image,
} from "@mantine/core";
import { useForceUpdate } from "@mantine/hooks";
import {
  IconArrowDown,
  IconArrowsDownUp,
  IconCaretDownFilled,
} from "@tabler/icons-react";
import { FormEvent, useCallback, useState } from "react";
import { convertToTransferFormData } from "./config";
import {
  AmountToTransferItemWidget,
  renderCoinSelectOption,
} from "@/ui/Form/widgets";
import { ASSET_COIN_OPTIONS, COIN_IMAGES } from "@/domain/config";

export function TransferForm(props: {
  accountTypeId?: string;
  coin?: string;
  accountIds?: string[];
  onSubmit?: (res: unknown) => void;
}) {
  const t = useSPETranslation();
  const { accountTypes: options } = assetStore();
  const forceUpdate = useForceUpdate();

  const initialFromAccount =
    props.accountTypeId ?? options?.[0]?.value;
  const initialToAccount = options.find(
    (opt) => opt.value !== initialFromAccount,
  )?.value;

  const { form, values } = useSPEForm<{
    coin?: string;
    fromAccountId?: string;
    toAccountId?: string;
    amount?: number;
  }>({
    initialValues: {
      coin: props.coin ?? "BTC",
      fromAccountId: initialFromAccount,
      toAccountId: initialToAccount,
      amount: 0,
    },
    onValuesChange: (values, prevValues) => {
      if (values.coin !== prevValues.coin) {
        form.setFieldValue("amount", 0);
      }
      if (values.fromAccountId === values.toAccountId) {
        const newToAccountId = options.find(
          (opt) => opt.value !== values.fromAccountId,
        )?.value;
        form.setFieldValue("toAccountId", newToAccountId);
      }
      forceUpdate();
    },
    validate: {
      amount(value) {
        try {
          numberValidate.parse(value);
          return null;
        } catch (e) {
          return t("Enter amount greater than 0");
        }
      },
    },
  });

  const [loading, setLoading] = useState(false);
  const api = "/api/transfer";

  const doSubmit = useCallback(() => {
    const params =
      convertToTransferFormData(
        values as (typeof convertToTransferFormData.arguments)[0],
      ) ?? values;
    setLoading(true);
    axios
      .post<SPEResponse>(api, params)
      .then((res) => {
        if (res.data.code === 0) {
          success(
            t("Transfer Successful"),
            t(
              "The transaction was successful and your funds have been transferred.",
            ),
          );
          props.onSubmit?.({});
        } else {
          error(t("Transfer Unsuccessful"), res.data.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [t, values, props]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (loading) {
      return false;
    }
    form.validate();
    if (form.isValid() === false) {
      return false;
    }
    doSubmit();
    return false;
  };

  const handleSwitchAccounts = useCallback(() => {
    const { fromAccountId, toAccountId } = form.getValues();

    form.setValues({
      ...values,
      fromAccountId: toAccountId,
      toAccountId: fromAccountId,
    });
  }, [form, values]);

  return (
    <Card
      p={"32px"}
      shadow="0 0 24px 0 rgba(18,18,20,.1)"
      padding="lg"
      radius="25px"
      maw={"600px"}
      w={"100%"}
      mx={"auto"}
      pos={"relative"}
    >
      <Title order={3}>{t("Transfer")}</Title>
      <Space my={10} />
      <form onSubmit={onSubmit}>
        <Flex direction={"column"} gap={10}>
          <Stack
            gap="0"
            style={{
              padding: 16,
              border: "1px solid #e0e0e0",
              borderRadius: 8,
            }}
            bg="light-dark(#f3f5f7, #26282c)"
          >
            <Flex align={"center"}>
              <Text w={200}>{t("From account")}</Text>
              <Select
                key={form.key("fromAccountId")}
                {...form.getInputProps("fromAccountId")}
                withAsterisk
                data={options}
                allowDeselect={false}
                rightSection={
                  <IconCaretDownFilled color="#81858d" size={15} />
                }
                renderOption={({ option, checked }) => {
                  return (
                    <Text
                      fz={14}
                      fw={"bold"}
                      c={checked ? "primary" : "dark"}
                    >
                      {option.label}
                    </Text>
                  );
                }}
                comboboxProps={{
                  offset: 0,
                  withinPortal: false,
                }}
                styles={{
                  root: {},
                  input: {
                    border: "none",
                    boxShadow: "none",
                    borderRadius: "0px",
                    background: "light-dark(#f3f5f7, #26282c)",
                    fontWeight: "bold",
                  },
                  dropdown: {
                    borderRadius: "0px",
                    border: "none",
                    padding: "0px",
                  },
                }}
              />
            </Flex>
            <Flex
              justify={"space-between"}
              w={"100%"}
              align={"center"}
            >
              <IconArrowDown size={20} color="grey" />
              <Button variant="subtle" onClick={handleSwitchAccounts}>
                <IconArrowsDownUp
                  color="var(--mantine-color-primary-5)"
                  size={20}
                />
              </Button>
            </Flex>
            <Flex align={"center"}>
              <Text w={200}>{t("To account")}</Text>
              <Select
                key={form.key("toAccountId")}
                {...form.getInputProps("toAccountId")}
                withAsterisk
                data={options.filter(
                  (opt) => opt.value !== values.fromAccountId,
                )}
                allowDeselect={false}
                rightSection={
                  <IconCaretDownFilled color="#81858d" size={15} />
                }
                renderOption={({ option, checked }) => {
                  return (
                    <Text
                      fz={14}
                      fw={"bold"}
                      c={checked ? "primary" : "dark"}
                    >
                      {option.label}
                    </Text>
                  );
                }}
                comboboxProps={{
                  offset: 0,
                  withinPortal: false,
                }}
                styles={{
                  root: {},
                  input: {
                    border: "none",
                    boxShadow: "none",
                    borderRadius: "0px",
                    background: "light-dark(#f3f5f7, #26282c)",
                    fontWeight: "bold",
                  },
                  dropdown: {
                    borderRadius: "0px",
                    border: "none",
                    padding: "0px",
                  },
                }}
              />
            </Flex>
          </Stack>

          <Select
            size="md"
            data={ASSET_COIN_OPTIONS}
            label={t("Choose coin to transfer")}
            withAsterisk={true}
            renderOption={renderCoinSelectOption}
            allowDeselect={false}
            key={form.key("coin")}
            {...form.getInputProps("coin")}
            leftSection={
              <>
                <Image
                  w={"22px"}
                  h={"22px"}
                  src={COIN_IMAGES[form.getValues()?.coin ?? ""]}
                />
              </>
            }
            rightSection={
              <IconCaretDownFilled color="#81858d" size={15} />
            }
            comboboxProps={{ offset: 0, withinPortal: false }}
          />
          <Box>
            <AmountToTransferItemWidget
              value={values.amount}
              onChange={(v) =>
                form.setFieldValue("amount", v as number)
              }
              formData={values}
              placeholder={t("Min 0.01")}
              label={t("Amount")}
              required
            />
            <InputError size="sm">{form.errors["amount"]}</InputError>
          </Box>
          <Button
            disabled={loading || !form.isValid()}
            loading={loading}
            type="submit"
            variant="gradient"
            gradient={{ from: "primary", to: "yellow", deg: 90 }}
          >
            {t("Submit")}
          </Button>
        </Flex>
      </form>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
    </Card>
  );
}
