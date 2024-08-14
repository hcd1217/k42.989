import { schema } from "@/domain/schema";
import useSPETranslation from "@/hooks/useSPETranslation";
import AppForm from "@/ui/Form/Form";
import { Card, Space, Title } from "@mantine/core";
import { IChangeEvent } from "@rjsf/core";
import { useMemo } from "react";
import { convertToTransferFormData } from "./config";

export function TransferForm(props: {
  coin?: string;
  accountIds?: string[];
  onSubmit?: (res: IChangeEvent) => void;
}) {
  const t = useSPETranslation();

  const formData = useMemo(() => {
    return {
      ...schema.TransferSchema.formData,
      fromAccountId: props.accountIds?.[0],
      toAccountId: props.accountIds?.[1],
      coin: props.coin,
    };
  }, [props.accountIds, props.coin]);

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
        <Title order={3}>{t("Transfer")}</Title>
        <Space my={10} />
        <AppForm
          xFlag
          w={"100%"}
          schema={schema.TransferSchema.schema}
          uiSchema={schema.TransferSchema.uiSchema}
          formData={formData}
          showJsonOutput
          api="/api/transfer"
          formDataConverter={convertToTransferFormData}
          messages={{
            titleError: t("Transfer Unsuccessful"),
            titleSuccess: t("Transfer Successful"),
            msgSuccess: t(
              "The transaction was successful and your funds have been transferred.",
            ),
          }}
          onSuccess={props.onSubmit}
        />
      </Card>
    </>
  );
}
