import MfaForm from "@/components/2FA";
import { schema } from "@/domain/schema";
import useSPETranslation from "@/hooks/useSPETranslation";
import { withdraw } from "@/services/apis";
import logger from "@/services/logger";
import authStore from "@/store/auth";
import { WithdrawData } from "@/types";
import AppForm from "@/ui/Form/Form";
import { error, success } from "@/utils/notifications";
import { Anchor, Box, Card, Space, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useCallback } from "react";
import { convertToWithdrawFormData } from "./config";
import { IconArrowRight } from "@tabler/icons-react";

export function WithdrawForm(props: {
  coin?: string;
  onSubmit: (res: unknown) => void;
}) {
  const t = useSPETranslation();
  const { me } = authStore();

  const onSubmit = useCallback(
    async (value: WithdrawData) => {
      try {
        const res = await withdraw(value);
        modals.closeAll();
        success(t("Success"), t("Withdraw Success"));
        props.onSubmit(res);
      } catch (e) {
        error(
          t("Withdraw Failed"),
          (e as Error).message || "An unexpected error occurred",
        );
        logger.debug(e);
      }
    },
    [props, t],
  );

  const handleSubmit = useCallback(
    (data: WithdrawData) => {
      if (me?.hasMfa) {
        modals.open({
          title: t("Two-factor authentication"),
          withCloseButton: false,
          children: (
            <MfaForm
              onSubmit={(value) => {
                onSubmit({ ...data, mfaCode: value });
              }}
            />
          ),
          centered: true,
        });

        return;
      }
    },
    [me?.hasMfa, onSubmit, t],
  );

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
        <Title order={3}>{t("Withdraw")}</Title>
        <Space my={10} />
        {me?.hasMfa ? (
          <AppForm
            w={"100%"}
            schema={schema.WithdrawSchema.schema}
            uiSchema={schema.WithdrawSchema.uiSchema}
            formData={{
              ...schema.WithdrawSchema.formData,
              coin: props.coin,
            }}
            showJsonOutput
            onSubmit={(e) =>
              handleSubmit(convertToWithdrawFormData(e.formData))
            }
          />
        ) : (
          <MfaPopup />
        )}
      </Card>
    </>
  );
}

const MfaPopup = () => {
  const t = useSPETranslation();
  return (
    <Box>
      <span>
        {t(
          "You haven't enabled Two-Factor Authentication (2FA). Please set up 2FA to proceed.",
        )}
      </span>
      <Anchor
        href="/user/bind-ga"
        style={{
          whiteSpace: "nowrap",
          alignItems: "center",
          display: "flex",
          gap: "0.6rem",
          justifyContent: "end",
        }}
        td="none"
        mt={"xs"}
      >
        <span>{t("Go to Bing GA")}</span>
        <IconArrowRight />
      </Anchor>
    </Box>
  );
};
