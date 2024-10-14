import { useSPEForm } from "@/hooks/useSPEForm";
import { GridTradeProps, SPEResponse } from "@/types";
import { Box, InputError } from "@mantine/core";
import { useCallback, useState } from "react";
import {
  LeverageItemWidget,
  OrderPriceInputFieldItemWidget,
  OrderSideItemWidget,
  OrderTypeItemWidget,
  PlaceOrderButtonsItemWidget,
  PostOnlyItemWidget,
  ReduceOnlyItemWidget,
  TimeInForceItemWidget,
  TriggerDirectionItemWidget,
  TriggerPriceInputFieldItemWidget,
  UiBalanceItemWidget,
  VolumeInputFieldItemWidget,
} from "../Form/widgets";
import { TimeInForce } from "@/common/enums";

import { convertToSpotTradeFormData } from "./config";
import axios from "@/services/apis";
import { error, success } from "@/utils/notifications";
import useSPETranslation from "@/hooks/useSPETranslation";
import { volumeValidate } from "@/utils/validates";

export function TradeForm({
  symbol,
  base,
  quote,
  onSuccess,
  isFuture,
}: GridTradeProps & { onSuccess?: () => void }) {
  const { form, values } = useSPEForm<{
    orderSide: "BUY" | "SELL";
    orderType: "Market" | "Limit" | "Conditional";
    postOnly: boolean;
    timeInForce: `${TimeInForce}`;
    isFuture: boolean;
    leverage: number;
    reduceOnly: boolean;
    triggerDirection: "UP" | "DOWN";
    triggerPrice: number;
    orderPrice: number;
    symbol: string;
    base: string;
    quote: string;
    volume: number;
  }>({
    initialValues: {
      orderSide: "BUY",
      orderType: "Market",
      postOnly: false,
      timeInForce: "GTC",
      isFuture: Boolean(isFuture),
      leverage: isFuture ? 5 : 1,
      reduceOnly: false,
      triggerDirection: "UP",
      triggerPrice: 0,
      orderPrice: 0,
      symbol,
      base,
      quote,
      volume: 0,
    },
    onValuesChange() {
      //
    },
    validate: {
      volume: volumeValidate,
    },
  });
  const t = useSPETranslation();
  const [loading, setLoading] = useState(false);
  const api = "/api/order/create";
  const submit = useCallback(() => {
    setLoading(true);
    const params =
      convertToSpotTradeFormData(
        values as (typeof convertToSpotTradeFormData.arguments)[0],
      ) ?? values;
    axios
      .post<SPEResponse>(api, params)
      .then((res) => {
        if (res.data.code === 0) {
          success(
            t("The form was submitted successfully."),
            t("The action was success"),
          );
          onSuccess?.();
          form.reset();
        } else {
          error(t("Something went wrong"), res.data.message);
        }
      })
      .catch(() => {
        error(t("Something went wrong"), "Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [values, onSuccess, t, form]);
  return (
    <Box>
      <form onSubmit={form.onSubmit(submit)}>
        <Box className="space-y-8">
          <OrderSideItemWidget
            formData={values}
            value={values.orderSide}
            onChange={(v) =>
              form.setFieldValue(
                "orderSide",
                v as typeof values.orderSide,
              )
            }
          />
          <OrderTypeItemWidget
            formData={values}
            value={values.orderType}
            onChange={(v) =>
              form.setFieldValue(
                "orderType",
                v as typeof values.orderType,
              )
            }
          />
          <UiBalanceItemWidget formData={values} />
          {isFuture && (
            <Box>
              <LeverageItemWidget
                value={values.leverage}
                formData={values}
                enum={[1, 5, 10, 20, 50, 100]}
                onChange={(v) =>
                  form.setFieldValue(
                    "leverage",
                    v as typeof values.leverage,
                  )
                }
              />
            </Box>
          )}
          <TriggerPriceInputFieldItemWidget
            formData={values}
            value={values.triggerPrice}
            onChange={(v) =>
              form.setFieldValue(
                "triggerPrice",
                v as typeof values.triggerPrice,
              )
            }
          />
          <TriggerDirectionItemWidget
            formData={values}
            value={values.triggerDirection}
            enum={["UP", "DOWN"]}
            onChange={(v) =>
              form.setFieldValue(
                "triggerDirection",
                v as typeof values.triggerDirection,
              )
            }
          />
          <OrderPriceInputFieldItemWidget
            formData={values}
            value={values.orderPrice}
            onChange={(v) =>
              form.setFieldValue(
                "orderPrice",
                v as typeof values.orderPrice,
              )
            }
          />
          <Box>
            <VolumeInputFieldItemWidget
              value={values.volume}
              formData={values}
              onChange={(v) =>
                form.setFieldValue(
                  "volume",
                  v as typeof values.volume,
                )
              }
            />
            <InputError
              size="sm"
              styles={{
                error: {},
              }}
            >
              {form.errors["volume"]}
            </InputError>
          </Box>
          <PostOnlyItemWidget
            value={values.postOnly}
            formData={values}
            onChange={(v) =>
              form.setFieldValue(
                "postOnly",
                v as typeof values.postOnly,
              )
            }
          />
          {isFuture && (
            <Box>
              <ReduceOnlyItemWidget
                value={values.reduceOnly}
                formData={values}
                onChange={(v) =>
                  form.setFieldValue(
                    "reduceOnly",
                    v as typeof values.reduceOnly,
                  )
                }
              />
            </Box>
          )}
          <TimeInForceItemWidget
            formData={values}
            value={values.timeInForce}
            enum={["GTC", "IOC", "FOK"]}
            onChange={(v) =>
              form.setFieldValue(
                "timeInForce",
                v as typeof values.timeInForce,
              )
            }
          />
          <PlaceOrderButtonsItemWidget
            loading={loading}
            formData={values}
            onSubmit={form.onSubmit(submit)}
          />
          {/* <JsonForm formData={values}/> */}
        </Box>
      </form>
    </Box>
  );
}
