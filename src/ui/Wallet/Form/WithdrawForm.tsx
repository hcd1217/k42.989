import { schema } from "@/domain/schema";
import AppForm from "@/ui/Form/Form";
import { Card, Space, Title } from "@mantine/core";
import { IChangeEvent } from "@rjsf/core";
import { convertToWithdrawFormData } from "./config";

export function WithdrawForm(props: {
  coin?: string;
  onSubmit: (res: IChangeEvent) => void;
}) {
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
        <Title order={3}>Withdraw</Title>
        <Space my={10} />
        <AppForm
          w={"100%"}
          schema={schema.WithdrawSchema.schema}
          uiSchema={schema.WithdrawSchema.uiSchema}
          formData={{
            ...schema.WithdrawSchema.formData,
            coin: props.coin,
          }}
          showJsonOutput
          api="/api/withdraw"
          formDataConverter={convertToWithdrawFormData}
          onSuccess={props.onSubmit}
        />
      </Card>
    </>
  );
}
