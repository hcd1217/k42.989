import { CoinsAsName, SwapSideAsName } from "@/domain/marketPrice";
import { useSPEForm } from "@/hooks/useSPEForm";
import useSPETranslation from "@/hooks/useSPETranslation";
import axios from "@/services/apis";
import { assetStore } from "@/store/assets";
import { SPEResponse } from "@/types";
import { CoinSwapItemWidget } from "@/ui/Form/widgets";
import { error, success } from "@/utils/notifications";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Flex,
  LoadingOverlay,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { IChangeEvent } from "@rjsf/core";
import { IconSwitchVertical } from "@tabler/icons-react";
import { FormEvent, useCallback, useMemo, useState } from "react";
import { convertToSwapFormData } from "./config";

type SwapFormProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coin?: string;
  onClose?: () => void;
  onSubmit: (res: IChangeEvent | unknown) => void;
};

type FormValueType = Partial<{
  side: "BUY" | "SELL";
  symbolFrom: string;
  symbolTo: string;
  volume: number;
  accountId: string;
}>;

export function SwapForm(props: SwapFormProps) {
  const { fundingAccount } = assetStore();
  const [loading, setLoading] = useState(false);
  const t = useSPETranslation();
  const { form, values } = useSPEForm<FormValueType>({
    initialValues: {
      accountId: fundingAccount?.id,
      side: "SELL",
      symbolFrom: props.coin,
      symbolTo: CoinsAsName.USDT,
      volume: 0,
    },
    onValuesChange: () => {
      // alert(JSON.stringify(values));
      form.setFieldValue("accountId", fundingAccount?.id);
    },
  });
  const api = "/api/order/swap";
  const doSwap = useCallback(() => {
    const params =
      convertToSwapFormData(
        values as (typeof convertToSwapFormData.arguments)[0],
      ) ?? values;
    setLoading(true);
    axios
      .post<SPEResponse>(api, params)
      .then((res) => {
        if (res.data.code === 0) {
          // props.onSuccess?.(res.data.result);
          success(
            t("The form was submitted successfully."),
            t("The action was success"),
          );
          props.onSubmit({});
        } else {
          // Error handling
          error(
            // props.messages?.titleError ??
            t("Something went wrong"),
            res.data.message,
          );
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
    doSwap();
    return false;
  };
  const options = useMemo(() => {
    if (values.side === "SELL") {
      return [
        [
          {
            label: CoinsAsName.BTC,
            value: CoinsAsName.BTC,
          },
          {
            label: CoinsAsName.ETH,
            value: CoinsAsName.ETH,
          },
        ],
        [
          {
            label: CoinsAsName.USDT,
            value: CoinsAsName.USDT,
          },
        ],
      ];
    }
    return [
      [
        {
          label: CoinsAsName.USDT,
          value: CoinsAsName.USDT,
        },
      ],
      [
        {
          label: CoinsAsName.BTC,
          value: CoinsAsName.BTC,
        },
        {
          label: CoinsAsName.ETH,
          value: CoinsAsName.ETH,
        },
      ],
    ];
  }, [values]);

  return (
    <>
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
        <Title order={3}>{t("Swap")}</Title>
        <Space my={10} />
        <form onSubmit={onSubmit}>
          <Flex direction={"column"} gap={10}>
            <CoinSwapItemWidget
              name="symbolFrom"
              value={values.symbolFrom}
              enumOptions={options[0]}
              formData={values}
              onChange={(data) => {
                //
                form.setFieldValue("symbolFrom", data as string);
              }}
              updateFields={(data) => {
                form.setFieldValue(
                  "volume",
                  data["volume"] as number,
                );
              }}
            />
            <Flex justify={"center"}>
              <ActionIcon
                onClick={() => {
                  const symbolTo = values.symbolFrom;
                  const symbolFrom = values.symbolTo;
                  const side =
                    values.side === SwapSideAsName.BUY
                      ? SwapSideAsName.SELL
                      : SwapSideAsName.BUY;
                  form.setValues({
                    side,
                    volume: 0,
                    symbolFrom,
                    symbolTo,
                  });
                }}
                radius={"xl"}
                variant="gradient"
                size={"lg"}
                gradient={{ from: "primary", to: "yellow", deg: 90 }}
              >
                <IconSwitchVertical color="black" size={20} />
              </ActionIcon>
            </Flex>
            <CoinSwapItemWidget
              name="symbolTo"
              value={values.symbolTo}
              enumOptions={options[1]}
              formData={values}
              onChange={(data) => {
                //
                form.setFieldValue("symbolTo", data as string);
              }}
              updateFields={(data) => {
                form.setFieldValue(
                  "volume",
                  data["volume"] as number,
                );
              }}
            />
            <Box>
              <Text c={"dimmed"}>
                {t(
                  "Notes: Due to market fluctuations, the final transaction results may be slightly different from the current display results.",
                )}
              </Text>
            </Box>
            <Button
              disabled={loading}
              loading={loading}
              type="submit"
              variant="gradient"
              gradient={{ from: "primary", to: "yellow", deg: 90 }}
            >
              {t("Swap")}
            </Button>
          </Flex>
        </form>
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
      </Card>
    </>
  );
}
