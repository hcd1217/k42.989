import { ASSET_COIN_OPTIONS, COIN_IMAGES } from "@/domain/config";
import { useSPEForm } from "@/hooks/useSPEForm";
import useSPETranslation from "@/hooks/useSPETranslation";
import {
  QrCodeAddressWidget,
  renderCoinSelectOption,
} from "@/ui/Form/widgets";
import {
  Button,
  Card,
  Flex,
  Image,
  InputError,
  Select,
  Text,
  Title,
} from "@mantine/core";
import { useForceUpdate } from "@mantine/hooks";
import { IconCaretDownFilled } from "@tabler/icons-react";
import { FormEvent, useCallback } from "react";

const lines: Record<string, string[]> = {
  USDT: [
    "Please don't deposit any other digital assets except USDT to the above address. Any other assets except USDT will not be recovered.",
    "USDT will be received only after 12 block confirmation, and it will be available to withdraw after 20 block confirmations",
    "The system will update the cryptocurrency address in stages. Please check your account regularly. Failure to do so may result in losses on your asset.",
    "Minimum deposit amount is 1. Any amount less than this will not be credited.",
  ],
  ETH: [
    "Please don't deposit any other digital assets except ETH to the above address. Any other assets except ETH will not be recovered.",
    "ETH will be received only after 64 block confirmation, and it will be available to withdraw after 64 block confirmations",
    "The system will update the cryptocurrency address in stages. Please check your account regularly. Failure to do so may result in losses on your asset.",
    "Minimum deposit amount is 0.001. Any amount less than this will not be credited.",
    "You can only deposit ETH via the functions of transfer or transfer From on Etherum network. We apologize that deposit via other functions will not be credited.",
    "We are currently not supporting Coinbase transfer. The transfer of Coinbase will not be credited. Thank you for your understanding",
    "You can only deposit ETH via the functions of transfer or transfer From on Etherum network. We apologize that deposit via other functions will not be credited.",
  ],
  BTC: [
    "Please don't deposit any other digital assets except BTC to the above address. Any other assets except BTC will not be recovered.",
    "BTC will be received only after 4 block confirmation, and it will be available to withdraw after 4 block confirmations",
    "The system will update the cryptocurrency address in stages. Please check your account regularly. Failure to do so may result in losses on your asset.",
    "Minimum deposit amount is 0.0001. Any amount less than this will not be credited.",
  ],
};

export function DepositForm(props: {
  maw?: string | number;
  coin: string;
  onClose?: () => void;
}) {
  const t = useSPETranslation();
  const forceUpdate = useForceUpdate();

  const { form, values } = useSPEForm<{
    coin?: string;
    chain?: string;
    walletAddress?: string;
  }>({
    initialValues: {
      coin: "USDT",
      chain: "TRON network",
    },
    onValuesChange: (values, previous) => {
      if (previous.coin === values.coin) {
        return;
      }
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
      walletAddress: (v) => {
        if (Boolean(v) === true) {
          return null;
        }
        return t("Required");
      },
    },
  });

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      form.validate();
      if (form.isValid() === false) {
        return false;
      }
      props?.onClose?.();
      return false;
    },
    [form, props],
  );

  return (
    <Card>
      <Title mb={10} order={3}>
        {t("Deposit")}
      </Title>
      <form onSubmit={onSubmit}>
        <Flex direction={"column"} gap={10}>
          <Select
            size="md"
            data={ASSET_COIN_OPTIONS}
            label={t("Choose coin to deposit")}
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
          <div>
            <QrCodeAddressWidget
              chain={values.chain ?? ""}
              coin={values.coin ?? ""}
              onChange={(depositAddress) => {
                form.setFieldValue("walletAddress", depositAddress);
              }}
            />
            <InputError size="lg">
              {form.errors["walletAddress"]}
            </InputError>
          </div>
          <div>
            <Text c={"dimmed"} fw={"bold"}>
              {t("Tips")}
            </Text>
            <ol
              className="space-y-6"
              style={{
                padding: "0px 40px",
                border: "1px solid #e2e8f0",
                overflow: "scroll",
                maxHeight: 150,
                color: "gray",
                marginTop: "10px",
              }}
            >
              {(lines[form.getValues().coin ?? ""] || []).map(
                (line, index) => (
                  <li key={index}>
                    <Text c={"dimmed"} fz={14}>
                      {t(line)}
                    </Text>
                  </li>
                ),
              )}
            </ol>
          </div>
          <Button type="submit">{t("Confirm")}</Button>
        </Flex>
      </form>
    </Card>
  );
}
