import BN from "@/common/big-number";
import { OrderSide } from "@/common/enums";
import { freeAmount } from "@/common/utils";
import useSPETranslation from "@/hooks/useSPETranslation";
import logger from "@/services/logger";
import { assetStore } from "@/store/assets";
import authStore from "@/store/auth";
import tradeStore from "@/store/trade";
import AppButton from "@/ui/Button/AppButton";
import NumberFormat from "@/ui/NumberFormat";
import { AppPopover } from "@/ui/Popover/AppPopover";
import AppText from "@/ui/Text/AppText";
import {
  Box,
  Checkbox,
  Flex,
  HoverCard,
  InputLabel,
  NumberInput,
  SegmentedControl,
  Select,
  Slider,
  Text,
} from "@mantine/core";
import { WidgetProps } from "@rjsf/utils";
import { IconCaretDownFilled } from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const BUY_AND_SELL = ["BUY", "SELL"];
const LONG_SHORT = ["LONG", "SHORT"];

export function OrderTypeWidget({
  name,
  formContext: { updateFields },
  ...props
}: WidgetProps) {
  return (
    <>
      <SegmentedControl
        onChange={(value) =>
          updateFields({
            [name]: value,
          })
        }
        className="control-segment-percent"
        data={props.schema.enum as string[]}
        size="xs"
        styles={{
          root: {
            gap: "20px",
            padding: "0px",
            background: "none",
          },
          label: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "14px",
            padding: "0px",
          },
          indicator: {
            display: "none",
          },
        }}
        withItemsBorders={false}
      />
    </>
  );
}

export function OrderSideWidget({
  name,
  value,
  formContext: { formData, updateFields },
}: WidgetProps) {
  const t = useSPETranslation();
  return (
    <SegmentedControl
      fullWidth
      value={_orderSideLabel(value, formData.isFuture)}
      data={
        formData.isFuture
          ? LONG_SHORT.map((el) => t(el))
          : BUY_AND_SELL.map((el) => t(el))
      }
      onChange={(side: string) => {
        const sideMap: Record<string, OrderSide> = {
          BUY: OrderSide.BUY,
          SELL: OrderSide.SELL,
          LONG: OrderSide.BUY,
          SHORT: OrderSide.SELL,
        };
        logger.trace("side", side);
        updateFields({ [name]: sideMap[side] });
      }}
      classNames={{
        indicator: _isBuy(value) ? "btn-long" : "btn-short",
      }}
      styles={{
        root: {
          padding: "0px",
        },
        indicator: {
          background: _isBuy(value) ? "#23b26b" : "#f0444b",
        },
        label: {
          fontWeight: "bolder",
        },
      }}
    />
  );
}

export function TriggerPriceInputFieldWidget({
  value,
  onChange,
  formContext: { formData },
}: WidgetProps) {
  const t = useSPETranslation();
  const { isLogin } = authStore();

  if (formData.orderType !== "Conditional") {
    return <></>;
  }

  return (
    <NumberInput
      disabled={!isLogin}
      label={t("Trigger Price")}
      classNames={{ label: "text-label-form" }}
      thousandSeparator=","
      decimalSeparator="."
      step={0.01}
      rightSectionWidth={50}
      value={value || _lastPrice(formData.symbol)}
      onChange={(value) => onChange(Number(value))}
      size="sm"
      rightSection={<></>}
    />
  );
}

export function TriggerDirectionWidget(props: WidgetProps) {
  const t = useSPETranslation();
  const { isLogin } = authStore();

  if (props.formContext?.formData?.orderType !== "Conditional") {
    return <></>;
  }

  return (
    <Flex gap={5} align="center" justify="space-between" w={"100%"}>
      <InputLabel className="text-label-form">
        {t("Trigger direction")}
      </InputLabel>
      <Select
        disabled={!isLogin}
        w={"80px"}
        value={props.value}
        data={props.schema.enum as string[]}
        onChange={(v) => props.onChange(v)}
        defaultValue="Good-Till-Canceled"
        withCheckIcon={false}
        rightSection={<IconCaretDownFilled size={14} />}
        rightSectionWidth={30}
        allowDeselect={false}
        size="xs"
        classNames={{
          root: "app-select",
          option: "app-select-option",
        }}
        comboboxProps={{
          position: "bottom",
          offset: 0,
          withinPortal: true,
          width: "auto",
        }}
        styles={{
          input: {
            border: "none",
            fontSize: "12px",
            textAlign: "right",
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            background: "light-dark(rgba(0,0,0, 0.05), #26282c)",
          },
          option: {
            fontSize: "12px",
          },
        }}
      />
    </Flex>
  );
}

export function OrderPriceInputFieldWidget({
  value,
  onChange,
  formContext: { formData },
}: WidgetProps) {
  const t = useSPETranslation();
  const { isLogin } = authStore();
  const changeByLast = useCallback(() => {
    onChange(_lastPrice(formData.symbol));
  }, [formData.symbol, onChange]);
  if (formData.orderType === "Market") {
    return <></>;
  }
  return (
    <NumberInput
      disabled={!isLogin}
      label={t("Order Price")}
      classNames={{ label: "text-label-form" }}
      thousandSeparator=","
      decimalSeparator="."
      rightSectionWidth={50}
      value={value || _lastPrice(formData.symbol)}
      step={0.001}
      onChange={(value) => onChange(Number(value))}
      size="sm"
      rightSection={
        <AppText
          onClick={changeByLast}
          style={{
            cursor: "pointer",
          }}
          fz={12}
          c={"primary"}
          fw={"bold"}
        >
          Last
        </AppText>
      }
    />
  );
}

export function LeverageWidget(props: WidgetProps) {
  const t = useSPETranslation();
  const { isLogin } = authStore();

  const options = useMemo(() => {
    return (
      props.schema?.enum?.map((item) => `${item?.toString()}x`) ?? []
    );
  }, [props.schema.enum]);
  return (
    <>
      <Box>
        <AppText fz={12} fw="bold">
          {t("Leverage")}
        </AppText>
        <SegmentedControl
          disabled={!isLogin}
          value={`${props.value}x`}
          onChange={(v) => {
            props.onChange(parseFloat(v));
          }}
          className="control-segment-percent"
          w={"100%"}
          h={25}
          data={options}
          size="xs"
          styles={{
            label: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              fontSize: "10px",
            },
            indicator: {},
            innerLabel: {
              height: "100%",
              fontSize: "12px",
            },
          }}
          withItemsBorders={false}
        />
      </Box>
    </>
  );
}

export function VolumeInputFieldWidget({
  value,
  onChange,
  formContext: { formData },
}: WidgetProps) {
  const t = useSPETranslation();
  const { isLogin } = authStore();
  const [percent, setPercent] = useState(0);
  const { openTrades, marketPrices, symbolMap } = tradeStore();
  const { tradingBalances } = assetStore();
  const { max, config } = useMemo(() => {
    const open = Number(
      openTrades.openPositions[formData.symbol] || 0,
    );
    const k = Math.sign(open);
    const currentSide = open < 0 ? OrderSide.SELL : OrderSide.BUY;
    const isReverse = k !== 0 && currentSide !== formData.orderSide;

    if (formData.reduceOnly && formData.isFuture) {
      if (!isReverse) {
        return { max: 0, config: symbolMap[formData.symbol] };
      }
      return {
        max: Math.abs(open),
        config: symbolMap[formData.symbol],
      };
    }

    let coin = formData.quote;
    if (!formData.isFuture) {
      coin = _isBuy(formData.orderSide)
        ? formData.quote
        : formData.base;
    }
    const balance = tradingBalances.find((el) => el.coin === coin);
    if (!balance) {
      return { max: 0, precision: 0 };
    }

    let max = 0;
    const free = freeAmount(balance);
    const price =
      Number(formData.orderPrice) || marketPrices[formData.symbol];
    if (!formData.isFuture) {
      max = Number(free);
      if (formData.orderSide === OrderSide.BUY) {
        max = Number(BN.div(max, price));
      }
    } else {
      max = Number(
        BN.div(BN.mul(formData.leverage || 1, free), price),
      );
    }

    if (formData.isFuture && isReverse) {
      max += Math.abs(open);
    }
    return {
      max: Number(max || 0),
      config: symbolMap[formData.symbol],
    };
  }, [
    formData.base,
    formData.isFuture,
    formData.leverage,
    formData.orderPrice,
    formData.orderSide,
    formData.quote,
    formData.reduceOnly,
    formData.symbol,
    marketPrices,
    openTrades.openPositions,
    symbolMap,
    tradingBalances,
  ]);

  return (
    <Box className="space-y-10">
      <NumberInput
        max={max}
        disabled={!isLogin}
        thousandSeparator=","
        decimalSeparator="."
        classNames={{ label: "text-label-form" }}
        label={t("Volume")}
        step={Number(config?.volumeStepSize) || 1}
        value={value}
        min={Number(config?.minVolume) || 0.001}
        onChange={(value) => {
          setPercent(
            Math.min(
              Number(BN.div(100 * Number(value), max, 2)),
              100,
            ),
          );
          onChange(Number(value));
        }}
        error={value > max ? t("Volume too large") : false}
        rightSectionWidth={60}
        size="sm"
        rightSection={
          <AppText fz={12} fw={"bold"}>
            {formData.base}
          </AppText>
        }
      />
      <Flex px={2} gap={2} align="center" justify="end">
        <Text size="xs" c="gray">
          {t("Max Volume")}:
        </Text>
        <Text size="xs" c="gray">
          <NumberFormat decimalPlaces={8} value={max} />
        </Text>
      </Flex>
      <Box py={20}>
        <Slider
          disabled={!isLogin}
          onChange={(percent) => {
            setPercent(percent);
            onChange(Number(BN.div(BN.mul(max, percent), 100, 3)));
          }}
          value={percent}
          color="primary"
          size="sm"
          max={100}
          marks={[
            { value: 0, label: "0%" },
            { value: 25, label: "20%" },
            { value: 50, label: "50%" },
            { value: 75, label: "75%" },
            { value: 100, label: "100%" },
          ]}
          styles={{
            label: {
              fontSize: "10px",
            },
            markLabel: {
              fontSize: "10px",
            },
          }}
        />
      </Box>
    </Box>
  );
}

export function UiBalanceWidget({
  formContext: { formData },
}: WidgetProps) {
  const { tradingBalanceMap } = assetStore();
  const t = useSPETranslation();
  const { coin, availableBalance } = useMemo(() => {
    const isBuy = _isBuy(formData?.orderSide || "BUY");
    let coin = isBuy ? formData.quote : formData.base;
    if (formData.isFuture) {
      coin = formData.quote;
    }
    const availableBalance =
      tradingBalanceMap[coin]?.availableMargin || 0;
    return {
      isBuy,
      coin,
      availableBalance,
    };
  }, [
    formData.base,
    formData.isFuture,
    formData?.orderSide,
    formData.quote,
    tradingBalanceMap,
  ]);

  return (
    <Flex justify="space-between" align="center" pt={10}>
      <HoverCard
        openDelay={200}
        width={280}
        shadow="md"
        position="top"
        withArrow
        arrowSize={12}
      >
        <HoverCard.Target>
          <InputLabel
            className="text-label-form"
            styles={{
              label: {
                cursor: "pointer",
                borderBottom:
                  "dashed 1px light-dark(rgba(0, 0, 0, 0.4), gray)",
              },
            }}
          >
            {t("Available Balance")}
          </InputLabel>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Text size="sm">
            {t(
              "Bonuses are not reflected in the Available Balance for Spot Trading",
            )}
          </Text>
        </HoverCard.Dropdown>
      </HoverCard>
      <Text fw="bolder" fz={12}>
        <NumberFormat value={availableBalance} decimalPlaces={4} />{" "}
        <span>{coin}</span>
      </Text>
    </Flex>
  );
}

export function PostOnlyWidget(props: WidgetProps) {
  const t = useSPETranslation();
  return (
    <ActionOnlyWidget
      tooltip={t(
        "The Post-Only order will only be executed as a maker order. If it can be executed immediately as a taker order, it will be automatically canceled",
      )}
      {...props}
      label={t("Post Only")}
    />
  );
}

export function ReduceOnlyWidget(props: WidgetProps) {
  const t = useSPETranslation();
  return (
    <ActionOnlyWidget
      tooltip={t(
        "The reduce-only order will only reduce your position size. Any order that might increase your position size will be canceled or adjusted",
      )}
      {...props}
      label={t("Reduce Only")}
    />
  );
}

export function TimeInForceWidget(props: WidgetProps) {
  const t = useSPETranslation();
  const { isLogin } = authStore();

  return (
    <Flex gap={5} align="center" justify="space-between">
      <InputLabel className="text-label-form">
        {t("Time in Force")}
      </InputLabel>
      <Select
        disabled={!isLogin}
        w={"80px"}
        value={props.value}
        data={props.schema.enum as string[]}
        onChange={(v) => props.onChange(v)}
        defaultValue="Good-Till-Canceled"
        withCheckIcon={false}
        rightSection={<IconCaretDownFilled size={14} />}
        rightSectionWidth={30}
        allowDeselect={false}
        size="xs"
        classNames={{
          root: "app-select",
          option: "app-select-option",
        }}
        comboboxProps={{
          position: "bottom",
          offset: 0,
          withinPortal: true,
          width: "auto",
        }}
        styles={{
          input: {
            border: "none",
            fontSize: "12px",
            textAlign: "right",
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            background: "light-dark(rgba(0,0,0, 0.05), #26282c)",
          },
          option: {
            fontSize: "12px",
          },
        }}
      />
    </Flex>
  );
}

export function PlaceOrderButtonsWidget({
  formContext: { formData, submit },
}: WidgetProps) {
  const { isLogin } = authStore();
  const navigate = useNavigate();
  const t = useSPETranslation();
  const isBuy = useMemo(() => {
    return formData?.orderSide === "BUY";
  }, [formData?.orderSide]);
  const label = useMemo(() => {
    if (!isLogin) {
      return t("Login to Trade");
    }
    if (formData.isFuture) {
      return isBuy ? t("BUY / LONG") : t("SELL / SHORT");
    }
    return isBuy
      ? `${t("BUY")} ${formData.base}`
      : `${t("SELL")} ${formData.base}`;
  }, [formData.base, formData.isFuture, isBuy, isLogin, t]);

  return (
    <AppButton
      onClick={() => {
        if (isLogin) {
          submit();
        } else {
          const { pathname, search } = window.location;
          navigate(
            `/login?redirect=${encodeURIComponent(
              pathname + search,
            )}`,
          );
        }
      }}
      fullWidth
      bg={isBuy ? "#23b26b" : "#f0444b"}
      styles={{
        label: {
          flexWrap: "wrap",
          textAlign: "center",
        },
      }}
      h={44}
    >
      <Text
        component="span"
        style={{ display: "block", width: "100%" }}
        fw={"bolder"}
        fz={14}
      >
        {label}
      </Text>
    </AppButton>
  );
}

function ActionOnlyWidget(
  props: Omit<WidgetProps, "label"> & {
    label?: string;
    tooltip?: string;
  },
) {
  const { isLogin } = authStore();
  return (
    <Box className="space-y-10" hidden={props.hidden}>
      <Checkbox
        disabled={!isLogin}
        checked={props.value}
        onChange={(event) => {
          props.onChange(event.currentTarget.checked);
        }}
        label={
          !props.label ? (
            ""
          ) : (
            <>
              <AppPopover
                withArrow={false}
                position="bottom-start"
                target={(_props) => ({
                  children: (
                    <InputLabel
                      onClick={() => props.onChange(!props.value)}
                      className="text-label-form"
                      onMouseLeave={_props.close}
                      onMouseEnter={_props.open}
                    >
                      {props.label || ""}
                    </InputLabel>
                  ),
                })}
                dropdown={() => ({
                  children: (
                    <div>
                      <AppText instancetype="WithTextTooltip">
                        {props.tooltip || ""}
                      </AppText>
                    </div>
                  ),
                })}
              ></AppPopover>
            </>
          )
        }
      />
    </Box>
  );
}

function _isBuy(value: string) {
  return ["BUY", "LONG"].includes(value);
}

function _orderSideLabel(side: OrderSide, isFuture: boolean) {
  if (isFuture) {
    switch (side) {
      case OrderSide.BUY:
        return "LONG";
      case OrderSide.SELL:
        return "SHORT";
    }
  }
  return side;
}

function _lastPrice(symbol: string) {
  return Math.floor(
    Number(tradeStore.getState().marketPrices?.[symbol] || 0),
  );
}
