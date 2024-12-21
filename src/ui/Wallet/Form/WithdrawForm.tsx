import { cleanObj } from "@/common/utils";
import MfaForm from "@/components/2FA";
import { ASSET_COIN_OPTIONS, COIN_IMAGES } from "@/domain/config";
import { useSPEForm } from "@/hooks/useSPEForm";
import useSPETranslation from "@/hooks/useSPETranslation";
import { sendMailVerificationCode, withdraw } from "@/services/apis";
import logger from "@/services/logger";
import authStore from "@/store/auth";
import { WithdrawData } from "@/types";
import {
  AmountToWithdrawItemWidget,
  renderCoinSelectOption,
  WithdrawAddressItemWidget,
} from "@/ui/Form/widgets";
import { error, success } from "@/utils/notifications";
import { requiredFieldSchema } from "@/utils/validates";
import {
  Anchor,
  Box,
  Button,
  Card,
  Flex,
  Image,
  InputError,
  Select,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure, useForceUpdate } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import {
  IconArrowRight,
  IconCaretDownFilled,
} from "@tabler/icons-react";
import { FormEvent, useCallback, useState } from "react";
import { Link } from "react-router-dom";

export function WithdrawForm(props: {
  coin?: string;
  onSubmit: (res: unknown) => void;
}) {
  const t = useSPETranslation();
  const { me } = authStore();
  const [loading, setLoading] = useState(false);
  const forceUpdate = useForceUpdate();
  const [sendMailVerificationCode, { toggle }] = useDisclosure(false);

  const { form, values } = useSPEForm<{
    coin?: string;
    chain?: string;
    amount?: number;
    address?: string;
    mfaCode?: string;
    verificationCode?: string;
  }>({
    initialValues: {
      coin: props.coin,
      chain: findChain(props.coin as string),
      amount: 0,
      address: "",
      mfaCode: "",
      verificationCode: "",
    },
    onValuesChange: (values) => {
      if (values.coin === "BTC") {
        form.setFieldValue("chain", "Bitcoin");
      }
      if (values.coin === "ETH") {
        form.setFieldValue("chain", "Ethereum");
      }
      if (values.coin === "USDT") {
        if (
          !["TRON network", "Ethereum"].includes(
            values.chain as string,
          )
        ) {
          form.setFieldValue("chain", "TRON network");
        }
      }
      forceUpdate();
    },
    validate: {
      address(value) {
        try {
          requiredFieldSchema.parse(value);
          return null;
        } catch (e) {
          return t("Field is required");
        }
      },
      amount(value) {
        if (parseFloat((value ?? "")?.toString()) <= 0) {
          return t("Field is required");
        }
        return null;
      },
    },
  });

  const onSubmit = useCallback(
    async (value: WithdrawData) => {
      try {
        setLoading(true);
        const res = await withdraw(value);
        modals.closeAll();
        success(t("Success"), t("Withdraw Success"));
        props.onSubmit(res);
        setLoading(false);
      } catch (e) {
        error(
          t("Withdraw Failed"),
          (e as Error).message || "An unexpected error occurred",
        );
        logger.debug(e);
        setLoading(false);
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
                onSubmit(
                  cleanObj({
                    ...data,
                    verificationCode: "",
                    mfaCode: value,
                  }),
                );
              }}
            />
          ),
          centered: true,
        });
      } else if (sendMailVerificationCode) {
        modals.open({
          title: t("Email Verification Code"),
          withCloseButton: false,
          children: (
            <MfaForm
              onSubmit={(value) => {
                onSubmit(
                  cleanObj({
                    ...data,
                    mfaCode: "",
                    verificationCode: value,
                  }),
                ).finally(toggle);
              }}
            />
          ),
          centered: true,
        });
      } else {
        return;
      }
    },
    [me?.hasMfa, sendMailVerificationCode, t, onSubmit, toggle],
  );

  const checkSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      form.validate();
      if (form.isValid() === false) {
        return false;
      } else {
        handleSubmit(values as WithdrawData);
      }
      return false;
    },
    [form, handleSubmit, values],
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
        {me?.hasMfa || sendMailVerificationCode ? (
          <form onSubmit={checkSubmit}>
            <Flex direction={"column"} gap={10}>
              <Select
                size="md"
                data={ASSET_COIN_OPTIONS}
                label={t("Choose coin to withdraw")}
                withAsterisk={true}
                renderOption={renderCoinSelectOption}
                allowDeselect={false}
                key={form.key("coin")}
                {...form.getInputProps("coin")}
                leftSection={
                  <>
                    <Image
                      w={"22px"}
                      h={"22px"}
                      src={COIN_IMAGES[form.getValues()?.coin ?? ""]}
                    />
                  </>
                }
                rightSection={
                  <IconCaretDownFilled color="#81858d" size={15} />
                }
                comboboxProps={{ offset: 0 }}
              />
              <Select
                size="md"
                key={form.key("chain")}
                {...form.getInputProps("chain")}
                disabled={["BTC", "ETH"].includes(values.coin ?? "")}
                data={
                  values.coin === "USDT"
                    ? ["TRON network", "Ethereum"]
                    : ["TRON network", "Ethereum", "Bitcoin"]
                }
                label={t("Chain")}
                withAsterisk
                allowDeselect={false}
                rightSection={
                  <IconCaretDownFilled color="#81858d" size={15} />
                }
                renderOption={({ option, checked }) => {
                  return (
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
                      {option.label}
                    </Text>
                  );
                }}
                comboboxProps={{
                  offset: 0,
                  withinPortal: false,
                }}
              />

              <Box>
                <AmountToWithdrawItemWidget
                  formData={values}
                  value={values.amount}
                  onChange={(v) =>
                    form.setFieldValue("amount", v as number)
                  }
                  placeholder="Min 0.01"
                  label="Amount"
                  required
                />
                <InputError
                  size="sm"
                  styles={{
                    error: {
                      transform: "translateY(-10px)",
                    },
                  }}
                >
                  {form.errors["amount"]}
                </InputError>
              </Box>
              <Box>
                <WithdrawAddressItemWidget
                  label={t("Address")}
                  placeholder={t("Please enter address")}
                  formData={values}
                  value={values.address}
                  required
                  onChange={(v) => {
                    form.setFieldValue("address", v as string);
                  }}
                />
                <InputError
                  size="sm"
                  styles={{
                    error: {
                      transform: "translateY(-20px)",
                    },
                  }}
                >
                  {form.errors["address"]}
                </InputError>
              </Box>
              <Button
                loading={loading}
                disabled={loading}
                type="submit"
              >
                {t("Submit")}
              </Button>
            </Flex>
          </form>
        ) : (
          <MfaPopup toggle={toggle} />
        )}
      </Card>
    </>
  );
}

const findChain = (coin: string) => {
  if (coin === "BTC") {
    return "Bitcoin";
  }
  if (coin === "ETH") {
    return "Ethereum";
  }
  if (coin === "USDT") {
    return "TRON network";
  }
  return "";
};

const MfaPopup = ({ toggle }: { toggle: () => void }) => {
  const t = useSPETranslation();

  return (
    <Box>
      <span>
        {t(
          "You haven't enabled Two-Factor Authentication (2FA). Please set up 2FA to proceed or request an email verification code.",
        )}
      </span>
      <Anchor
        component={Link}
        to="/user/bind-ga"
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
        <span>{t("Go to Bind GA")}</span>
        <IconArrowRight />
      </Anchor>
      <Anchor
        mt={"xs"}
        td="none"
        variant="subtle"
        onClick={async () => {
          await sendMailVerificationCode()
            .then(() => {
              success(
                t("Success"),
                t("Email verification code sent successfully"),
              );
            })
            .catch(() => {
              error(
                t("Something went wrong"),
                t("Cannot send email verification code"),
              );
            })
            .finally(() => {
              toggle();
            });
        }}
        style={{
          whiteSpace: "nowrap",
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          gap: "0.6rem",
        }}
      >
        <span>{t("Send Email Verification Code")}</span>
        <IconArrowRight />
      </Anchor>
    </Box>
  );
};
