import BN from "@/common/big-number";
import {
  APP_CONFIG,
  ASSET_COIN_LIST,
  SWAP_RATE,
} from "@/common/configs";
import { freeAmount } from "@/common/utils";
import { ASSET_COIN_OPTIONS, COIN_IMAGES } from "@/domain/config";
import {
  convertCoinToCoinUsingRate,
  SwapSideAsName,
} from "@/domain/marketPrice";
import { default as useTranslation } from "@/hooks/useSPETranslation";
import { fetchDepositAddressApi } from "@/services/apis";
import { assetStore } from "@/store/assets";
import tradeStore from "@/store/trade";
import NumberFormat from "@/ui/NumberFormat";
import { SPECopyButton } from "@/ui/SPEMisc";
import {
  Box,
  Button,
  Card,
  ComboboxItem,
  ComboboxLikeRenderOptionInput,
  Divider,
  Flex,
  Image,
  InputLabel,
  LoadingOverlay,
  NumberInput,
  Select,
  Space,
  Text,
  TextInput,
} from "@mantine/core";
import {
  useClickOutside,
  useDisclosure,
  useFocusTrap,
} from "@mantine/hooks";
import { WidgetProps } from "@rjsf/utils";
import {
  IconCaretDownFilled,
  IconCaretUpFilled,
} from "@tabler/icons-react";
import { QRCodeSVG } from "qrcode.react";
import { useCallback, useEffect, useMemo } from "react";
import useSWR from "swr";

type TypeOfWidget = {
  formData: Record<string, unknown>;
  updateFields?: (fields: Record<string, unknown>) => void;
  onChange?: (value: unknown) => void;
  enumOptions?: {
    label: string;
    value: string;
  }[];
  value?: unknown;
  name?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
};

export function SelectCoinWidget(props: WidgetProps) {
  return (
    <>
      <Select
        placeholder={props.placeholder}
        value={props.value}
        data={ASSET_COIN_OPTIONS}
        onChange={(v) => props.onChange(v)}
        label={props.label ? props.label : ""}
        withAsterisk={props.required}
        renderOption={renderCoinSelectOption}
        allowDeselect={false}
        leftSection={
          <>
            <Image
              w={"22px"}
              h={"22px"}
              src={COIN_IMAGES[props.value]}
            />
          </>
        }
        rightSection={
          <IconCaretDownFilled color="#81858d" size={15} />
        }
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
        {...(props.options?.props as any)} // eslint-disable-line
      />
    </>
  );
}

export function QrCodeAddressWidget(props: {
  coin?: string;
  value?: string;
  chain?: string;
  onChange?: (depositAddress: string) => void;
}) {
  const t = useTranslation();
  const { data, isLoading } = useSWR(
    [props.coin, props.chain],
    ([_coin, _chain]) => {
      return fetchDepositAddressApi({
        coin: (_coin as string) ?? "USDT",
        chain: _chain ?? "TRON network",
      });
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      onSuccess(data) {
        props?.onChange?.(data);
      },
    },
  );

  return (
    <Box pos="relative">
      <Box>
        <InputLabel className="mantine-InputWrapper-label" size="md">
          {t("Confirm deposit details")}
        </InputLabel>
      </Box>
      <Flex
        py={10}
        px={20}
        align={"center"}
        justify={"center"}
        gap={20}
        styles={{
          root: {
            background: "light-dark(#f3f5f7, #26282c)",
            borderRadius: "10px",
          },
        }}
      >
        <Box w={"70%"}>
          <TextInput
            styles={{
              input: {
                background: "light-dark(white, black)",
                border: "none",
                fontWeight: "bolder",
                fontSize: "14px",
              },
              label: {
                color: "#8a8e96",
                fontSize: "14px",
              },
            }}
            label={`${props.coin} ${t("Address")}`}
            value={data || ""}
            readOnly
            rightSectionWidth={80}
            rightSection={<SPECopyButton value={data || ""} />}
          />
        </Box>
        <Box>
          <QRCodeSVG value={data ?? ""} />
        </Box>
      </Flex>
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
    </Box>
  );
}

export function AmountToWithdrawItemWidget({
  value,
  label,
  required,
  onChange,
  formData,
  placeholder,
}: TypeOfWidget) {
  const t = useTranslation();
  const { fundingBalances } = assetStore();
  const balanceByCoin = useMemo(() => {
    if (!formData.coin) {
      return 0;
    }
    return freeAmount(
      fundingBalances.find((el) => el.coin === formData.coin) || {},
    );
  }, [fundingBalances, formData?.coin]);

  const isZero = useMemo(
    () => Number(balanceByCoin) === 0,
    [balanceByCoin],
  );

  return (
    <Box pos={"relative"}>
      <NumberInput
        label={label}
        value={(value as number | string) || ""}
        rightSectionWidth={120}
        hideControls
        disabled={isZero}
        withAsterisk={required}
        onChange={(v) => onChange?.(v)}
        rightSectionPointerEvents="all"
        placeholder={placeholder}
        min={0}
        styles={{
          label: {
            fontSize: "14px",
          },
          input: {
            cursor: isZero ? "not-allowed" : "pointer",
            background: "light-dark(#f3f5f7, #26282c)",
            border: "none",
            fontWeight: "bolder",
          },
        }}
        rightSection={
          <Flex
            w={"100%"}
            gap={8}
            justify={"end"}
            pr={10}
            align={"center"}
          >
            <Text
              fw="bold"
              c="primary"
              className={isZero ? "" : "cursor-pointer"}
              onClick={() => !isZero && onChange?.(balanceByCoin)}
            >
              {t("All")}
            </Text>
            <Divider h={12} c={"red"} bg={"gray"} w={1} />
            <Text fw={"bold"}>{formData?.coin as string}</Text>
          </Flex>
        }
      />
      <Flex justify={"end"} right={0}>
        <Text fz={12} fw={"bold"} c="dimmed">
          {t("Total")}:{" "}
          <NumberFormat value={balanceByCoin} decimalPlaces={8} />{" "}
          {formData?.coin as string}
        </Text>
      </Flex>
    </Box>
  );
}

export function AmountToTransferItemWidget({
  value,
  label,
  required,
  onChange,
  formData,
  placeholder,
}: TypeOfWidget) {
  const t = useTranslation();
  const { balances } = assetStore();
  const balanceByCoin = useMemo(() => {
    if (!formData.fromAccountId || !formData.coin) {
      return 0;
    }
    return freeAmount(
      balances
        .filter((el) => el.accountId === formData.fromAccountId)
        .find((el) => el.coin === formData.coin) || {},
    );
  }, [balances, formData?.coin, formData.fromAccountId]);

  const isZero = useMemo(
    () => Number(balanceByCoin) === 0,
    [balanceByCoin],
  );

  return (
    <Box pos={"relative"}>
      <NumberInput
        hideControls
        value={Number(value || "")}
        label={label || ""}
        disabled={isZero}
        withAsterisk={required}
        rightSectionWidth={120}
        placeholder={placeholder}
        min={0}
        onChange={(v) => {
          onChange?.(v);
        }}
        rightSectionPointerEvents="all"
        styles={{
          label: {
            fontSize: "14px",
          },
          input: {
            fontSize: "14px",
            cursor: isZero ? "not-allowed" : "pointer",
            background: "light-dark(#f3f5f7, #26282c)",
            border: "none",
            fontWeight: "bolder",
          },
        }}
        rightSection={
          <Flex
            w={"100%"}
            gap={8}
            justify={"end"}
            pr={10}
            align={"center"}
          >
            <Text
              fw="bold"
              c="primary"
              className={isZero ? "" : "cursor-pointer"}
              onClick={() => {
                if (!isZero) {
                  const balance = Number(balanceByCoin);
                  onChange?.(balance);
                }
              }}
            >
              {t("All")}
            </Text>
            <Divider h={12} c={"red"} bg={"gray"} w={1} />
            <Text fw={"bold"}>{formData?.coin as string}</Text>
          </Flex>
        }
      />
      <Space my={"xs"} />
      <Flex justify={"end"} right={0}>
        <Text fz={12} fw={"bold"} c="dimmed">
          {t("Total")}:{" "}
          <NumberFormat value={balanceByCoin} decimalPlaces={8} />{" "}
          {formData?.coin as string}
        </Text>
      </Flex>
    </Box>
  );
}

export function WithdrawAddressItemWidget({
  formData,
  ...props
}: TypeOfWidget) {
  const t = useTranslation();
  const chain = useMemo(() => {
    return formData.chain as string;
    // const coinData = formData?.[`info${formData?.coin}`];
    // return coinData ? (coinData?.["chain"] as string) : "";
  }, [formData]);
  return (
    <>
      <TextInput
        onChange={(v) => props.onChange?.(v.target.value || "")}
        value={props.value as string}
        styles={{
          label: {
            fontSize: "14px",
          },
          input: {
            fontSize: "14px",
            background: "light-dark(#f3f5f7, #26282c)",
            border: "none",
            fontWeight: "bolder",
          },
        }}
        label={props.label ? props.label : ""}
        placeholder={props.placeholder ? props.placeholder : ""}
        withAsterisk={props.required}
      />
      <span
        style={{
          width: "100%",
          textAlign: "right",
          marginTop: "5px",
          fontSize: "14px",
          color: "red",
          display: "block",
        }}
      >
        {t("Withdraw Fee")}: &nbsp;
        {APP_CONFIG.WITHDRAW_FEE_MAPS[chain]?.[
          formData.coin as string
        ] || 0}
        &nbsp;
        {formData.coin as string}
      </span>
    </>
  );
}

export function renderCoinSelectOption({
  option,
  checked,
}: ComboboxLikeRenderOptionInput<ComboboxItem>) {
  return (
    <Flex align={"center"} gap={10} w={"100%"}>
      <Flex gap={5} align={"center"}>
        <Box>
          <Image
            w={"30px"}
            h={"30px"}
            src={COIN_IMAGES[option.value]}
          />
        </Box>
        <Box>
          <Text
            fz={16}
            fw={"bold"}
            styles={{
              root: {
                color: checked
                  ? "#f29525"
                  : "light-dark(#81858c, white)",
              },
            }}
          >
            {option.value}
          </Text>
          <Text
            fz={12}
            styles={{
              root: {
                color: "light-dark(#81858c, white)",
              },
            }}
          >
            {ASSET_COIN_LIST[option.value]}
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}

export function CoinSwapItemWidget({
  formData,
  updateFields,
  ...props
}: TypeOfWidget) {
  const t = useTranslation();
  const focusTrapRef = useFocusTrap();
  const { fundingBalances } = assetStore();
  const { marketPrices } = tradeStore();

  useEffect(() => {
    const coinFirst = props.enumOptions?.[0].value;
    const isExist = props.enumOptions?.find(
      (i) => i.value === props.value,
    );
    if (isExist === undefined) {
      props?.onChange?.(coinFirst);
    }
  }, [props, props.enumOptions]);

  const balance = useMemo(() => {
    return fundingBalances.find((el) => el.coin === props.value);
  }, [props.value, fundingBalances]);

  const coins = useMemo(() => {
    return props.enumOptions ?? [];
  }, [props.enumOptions]);

  const isFrom = useMemo(() => {
    return props.name === "symbolFrom";
  }, [props.name]);

  const addAll = useCallback(() => {
    updateFields?.({
      volume: parseFloat(balance?.amount as string),
    });
  }, [updateFields, balance?.amount]);

  const outputAmount = useMemo(() => {
    if (isFrom) {
      return formData.volume;
    }
    const info = convertCoinToCoinUsingRate(
      formData.symbolFrom as string,
      formData.symbolTo as string,
      marketPrices,
    );
    if (formData.side === SwapSideAsName.BUY) {
      return BN.mul(
        BN.div(formData.volume as string, info.price),
        1 - SWAP_RATE,
      );
    }
    return BN.mul(
      formData.volume as string,
      info.price,
      1 - SWAP_RATE,
    );
  }, [
    formData.side,
    formData.symbolFrom,
    formData.symbolTo,
    formData.volume,
    isFrom,
    marketPrices,
  ]);

  const [dropdownOpened, { toggle, close }] = useDisclosure();
  const ref = useClickOutside(() => close());

  return (
    <>
      <Card
        shadow="none"
        radius={"16px"}
        styles={{
          root: {
            background: "light-dark(#f3f5f7, rgba(0, 0, 0, 0.1))",
            overflow: "visible",
          },
        }}
      >
        <Flex justify={"space-between"}>
          <Text
            c={"dimmed"}
            styles={{
              root: {
                fontSize: "14px",
              },
            }}
          >
            {isFrom ? t("From") : t("To")}
          </Text>
          <Text
            c={"dimmed"}
            styles={{
              root: {
                fontSize: "14px",
              },
            }}
          >
            {t("Available")}: {balance?.coin}{" "}
            <NumberFormat value={balance?.amount} decimalPlaces={8} />
          </Text>
        </Flex>
        <Box pos={"relative"} pt={11}>
          <Box pos={"relative"} bd={"1px"}>
            <Button
              pos={"absolute"}
              top={0}
              left={0}
              styles={{
                root: {
                  background:
                    "light-dark(#f3f5f7, rgba(0, 0, 0, 0.04))",
                  color: "black",
                  zIndex: 2,
                  width: "fit-content",
                  padding: 0,
                  margin: 0,
                },
              }}
              onClick={toggle}
              mb="md"
              ref={ref}
              justify="space-between"
              fullWidth
              rightSection={
                <>
                  {dropdownOpened ? (
                    <IconCaretUpFilled color="#81858d" size={15} />
                  ) : (
                    <IconCaretDownFilled color="#81858d" size={15} />
                  )}
                </>
              }
            >
              <Flex gap={8} align={"center"}>
                <Box>
                  <Image
                    w={"28px"}
                    h={"28px"}
                    src={COIN_IMAGES[props.value as string]}
                  />
                </Box>
                <Flex direction={"column"} justify={"start"}>
                  <Text
                    fz={14}
                    fw={"bold"}
                    styles={{
                      root: {
                        textAlign: "left",
                      },
                    }}
                  >
                    {props.value as string}
                  </Text>
                  <Text fz={12} c={"#81858c"}>
                    {ASSET_COIN_LIST[props.value as string]}
                  </Text>
                </Flex>
              </Flex>
            </Button>
            <Select
              pos={"relative"}
              value={props.value as string}
              onChange={(v) => props?.onChange?.(v)}
              data={coins}
              allowDeselect={false}
              rightSection={
                <IconCaretDownFilled color="#81858d" size={15} />
              }
              renderOption={({ option, checked }) => {
                return (
                  <>
                    <Flex align={"center"} gap={10} w={"100%"}>
                      <Flex gap={5} align={"center"}>
                        <Image
                          w={"28px"}
                          h={"28px"}
                          src={COIN_IMAGES[option.value]}
                        />
                        <Flex direction={"column"}>
                          <Text
                            fz={14}
                            fw={"bold"}
                            styles={{
                              root: {
                                // var(--mantine-color-dark-2)
                                color: checked
                                  ? "var(--mantine-color-primary-5)"
                                  : "light-dark(var(--mantine-color-dark-2), var(--mantine-color-dark-1))",
                              },
                            }}
                          >
                            {option.value}
                          </Text>
                          <Text
                            fz={12}
                            styles={{
                              root: {
                                color: "light-dark(#81858c, white)",
                              },
                            }}
                          >
                            {ASSET_COIN_LIST[option.value]}
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>
                  </>
                );
              }}
              comboboxProps={{
                offset: 18,
                withinPortal: false,
                dropdownPadding: 0,
                styles: {
                  dropdown: {
                    // border: "none",
                    zIndex: 999999999,
                  },
                },
              }}
              styles={{
                root: {
                  zIndex: 3,
                },
                input: {
                  border: "none",
                  boxShadow: "none",
                  borderRadius: "0px",
                  background: "light-dark(#f3f5f7, #26282c)",
                  fontWeight: "bold",
                  opacity: 0,
                },
                dropdown: {
                  borderRadius: "0px",
                  border: "none",
                  padding: "0px",
                  width: "500px",
                  maxWidth: "unset",
                },
                section: {
                  opacity: 0,
                },
              }}
            />
          </Box>
          <Box
            pos={"absolute"}
            style={{
              right: "0px",
              bottom: "0px",
              width: "55%",
              zIndex: 3,
            }}
          >
            <NumberInput
              hideControls
              size="xs"
              ref={focusTrapRef}
              placeholder={isFrom ? "0.0005-2.9999" : "--"}
              rightSectionWidth={isFrom ? 30 : 0}
              disabled={!isFrom}
              value={
                (isFrom
                  ? (formData.volume as number)
                  : (outputAmount as number)) || 0
              }
              onChange={(amount) =>
                updateFields?.({ volume: amount })
              }
              styles={{
                input: {
                  border: "none",
                  background: "none",
                  fontWeight: "bold",
                  color: "light-dark(#121214, white)",
                  textAlign: "right",
                },
              }}
              rightSection={
                <>
                  {isFrom && (
                    <Flex
                      gap={8}
                      align={"center"}
                      justify={"end"}
                      w={"100%"}
                    >
                      <Text
                        onClick={() => addAll()}
                        className="cursor-pointer"
                        c={"primary"}
                        fz={"16px"}
                        fw={600}
                        style={{
                          border: "none",
                        }}
                        variant="transparent"
                        p={0}
                        m={0}
                      >
                        {t("All")}
                      </Text>
                    </Flex>
                  )}
                </>
              }
              rightSectionPointerEvents="all"
              min={0}
            />
          </Box>
        </Box>
      </Card>
    </>
  );
}
