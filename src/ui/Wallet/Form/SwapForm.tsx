import { schema } from "@/domain/schema";
import AppForm from "@/ui/Form/Form";
import { Card, Space, Title } from "@mantine/core";
import { IChangeEvent } from "@rjsf/core";
import { useMemo } from "react";
import { convertToSwapFormData } from "./config";

type SwapFormProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coin?: string;
  onClose?: () => void;
  onSubmit: (res: IChangeEvent) => void;
};
export function SwapForm(props: SwapFormProps) {
  const formData = useMemo(() => {
    if (!props.coin) {
      return { ...schema.SwapSchema.formData };
    }
    let side = "SELL",
      symbolTo = "USDT";
    if (props.coin === "USDT") {
      side = "BUY";
      symbolTo = "BTC";
    }
    return {
      side,
      volume: 0,
      symbolFrom: props.coin,
      symbolTo,
    };
  }, [props.coin]);

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
      >
        <Title order={3}>Swap</Title>
        <Space my={10} />
        <AppForm
          w={"100%"}
          xFlag
          schema={schema.SwapSchema.schema}
          uiSchema={schema.SwapSchema.uiSchema}
          formData={formData}
          showJsonOutput
          api="/api/order/swap"
          formDataConverter={convertToSwapFormData}
          onSuccess={props.onSubmit}
        />
      </Card>
    </>
  );
}
