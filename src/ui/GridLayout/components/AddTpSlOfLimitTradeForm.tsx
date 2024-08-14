import { schema } from "@/domain/schema";
import AppButton from "@/ui/Button/AppButton";
import AppForm from "@/ui/Form/Form";
import { Box, SimpleGrid } from "@mantine/core";
import { IChangeEvent } from "@rjsf/core";
import { useCallback, useRef } from "react";

interface AddTPSLProps {
  orderPrice: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (res: IChangeEvent) => void;
  onClose?: () => void;
}
export function AddTpSlOfTradeForm({
  orderPrice = 0.4907,
  ...props
}: AddTPSLProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formRef = useRef<any>(null);
  const confirm = useCallback(() => {
    formRef.current?.submit();
  }, [formRef]);

  return (
    <>
      <Box className="space-y-20" h={"100%"} mah={"698px"}>
        <AppForm
          w={"100%"}
          ref={formRef}
          schema={schema.AddTPandSLOfTrade.schema}
          uiSchema={schema.AddTPandSLOfTrade.uiSchema}
          formData={{
            ...schema.AddTPandSLOfTrade.formData,
            orderPrice,
          }}
          onSubmit={(_props) => {
            if (props.onSubmit) {
              props?.onSubmit(_props);
            }
          }}
          showJsonOutput
        />
        <SimpleGrid
          cols={2}
          py={10}
          styles={{
            root: {
              position: "sticky",
              bottom: 0,
              left: 0,
              zIndex: 4,
              background: "light-dark(white, #16171a)",
            },
          }}
        >
          <AppButton color="primary" onClick={confirm}>
            Confirm
          </AppButton>
          <AppButton
            color="gray"
            onClick={() => {
              if (props.onClose) {
                props.onClose();
              }
            }}
          >
            Cancel
          </AppButton>
        </SimpleGrid>
      </Box>
    </>
  );
}
