import { schema } from "@/domain/schema";
import useSPETranslation from "@/hooks/useSPETranslation";
import AppForm from "@/ui/Form/Form";
import { Card, Title } from "@mantine/core";

export function DepositForm(props: {
  maw?: string | number;
  coin: string;
  onClose?: () => void;
}) {
  const t = useSPETranslation();
  return (
    <Card>
      <Title mb={10} order={3}>
        {t("Deposit")}
      </Title>
      <AppForm
        w={"100%"}
        schema={schema.DepositSchema.schema}
        uiSchema={schema.DepositSchema.uiSchema}
        onSubmit={props.onClose}
        formData={{
          ...schema.DepositSchema.formData,
          coin: props.coin || schema.DepositSchema.formData || "USDT",
        }}
        showJsonOutput
      />
    </Card>
  );
}
