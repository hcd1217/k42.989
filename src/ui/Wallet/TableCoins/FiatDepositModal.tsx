import useSPETranslation from "@/hooks/useSPETranslation";
import authStore from "@/store/auth";
import { SPECopyButton } from "@/ui/SPEMisc";
import {
  Alert,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Modal,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAlertTriangle } from "@tabler/icons-react";

export function FiatDepositModal() {
  const [opened, { open, close }] = useDisclosure(false);
  const t = useSPETranslation();
  const { me } = authStore();

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={t("Fiat Deposit")}
        centered
        styles={{
          close: {
            display: "none",
          },
          header: {},
        }}
        size={"lg"}
      >
        <SimpleGrid
          cols={2}
          styles={{
            root: {
              gap: 5,
            },
          }}
        >
          <Box fw={"bold"} fz={14}>
            {t("Bank name")}
          </Box>
          <Box c={"dimmed"}>
            <Flex justify={"end"}>京葉銀行</Flex>
          </Box>
          <Box fw={"bold"} fz={14}>
            {t("Branch name")}
          </Box>
          <Box c={"dimmed"}>
            <Flex justify={"end"}>船橋 (店番：111)</Flex>
          </Box>
          <Box fw={"bold"} fz={14}>
            {t("Account Number")}
          </Box>
          <Box c={"dimmed"}>
            <Flex justify={"end"}>普通 9698701</Flex>
          </Box>
          <Box fw={"bold"} fz={14}>
            {t("Account Name")}
          </Box>
          <Box c={"dimmed"}>
            <Flex justify={"end"}>フクカワ（ド</Flex>
          </Box>
          <Text
            fz={14}
            fw={"bold"}
            w={"fit-content"}
            className="cursor-pointer"
          >
            Transfer request
          </Text>
        </SimpleGrid>
        <Card
          px={20}
          styles={{
            root: {
              background:
                "light-dark(#f6f5f8, var(--mantine-color-dark-6))",
            },
          }}
        >
          <Flex gap={10} align={"center"}>
            <Text fw={"bold"}>{t("Half angle example")}</Text>
            <Box h={20}>
              <Divider h={"100%"} orientation="vertical" />
            </Box>
            <Text>{me?.fiatDepositMemo || "---"}</Text>
            <Box ml={"auto"}>
              <SPECopyButton value={me?.fiatDepositMemo || ""} />
            </Box>
          </Flex>
        </Card>
        <Box my={20}>
          <Alert
            radius={15}
            variant="light"
            color="red"
            icon={
              <Box>
                <IconAlertTriangle size={30} />
              </Box>
            }
            styles={{
              body: {},
              root: {
                alignItems: "center",
              },
              wrapper: {
                alignItems: "center",
                gap: "20px",
              },
            }}
          >
            <Text c={"red"}>
              {t(
                "The minimum deposit amount is 10 USDT deposits below this amount will not be credited",
              )}
            </Text>
          </Alert>
        </Box>
        <Text fw={"bold"}>
          {t("Please take note of the following procedures")}:
        </Text>
        <ul
          style={{
            padding: "0 20px",
            overflow: "scroll",
            maxHeight: 200,
          }}
        >
          <li>
            <Text fz={14}>
              <strong>
                {t(
                  "Please enter the 4-digit note code when making a transfer",
                )}
                :
              </strong>{" "}
              {t(
                "If you did not include your 4-digit code in your bank transfer, or misplaced it somewhere else, please contact our customer service for assistance immediately.",
              )}
            </Text>
          </li>
          <li>
            <Text fz={14}>
              <strong>
                {t(
                  "Deposits made in local currency will be converted to USDT based on the prevailing exchange rate at the time of payment.",
                )}
              </strong>{" "}
              {t(
                "Fiat to USDT conversions are subject to exchange rate fluctuations (quoted from Investing.com) and include certain handling fees. %s reserves the right of any amendments or final interpretation regarding fiat to USDT conversion service. Thank you for your understanding.",
                localStorage.__APP_NAME__,
              )}
            </Text>
          </li>
          <li>
            <Text fz={14}>
              {t("Funds will be credited within 1 business day.")}
            </Text>
          </li>
          <li>
            <Text fz={14}>
              {t(
                "This payment method does not support transfers from banks located outside of Japan.",
              )}
            </Text>
          </li>
          <li>
            <Text fz={14}>
              {t(
                "For transactions exceeding 3 million yen, our compliance team may need to review and approve your transfer. This could result in longer processing times. Please be patient during this period. You are restricted to one deposit at a time. Subsequent deposits can only be made after the previous one has been processed.",
              )}
            </Text>
          </li>
          <li>
            <Text fz={14}>
              {t(
                "To prevent money laundering, withdrawal procedures will not be processed unless one week has passed since the deposit and there has been at least one trade.",
              )}
            </Text>
          </li>
        </ul>
        <Box mt={40}>
          <Button
            fullWidth
            onClick={close}
            variant="gradient"
            size="lg"
            gradient={{ from: "primary", to: "yellow", deg: 90 }}
            radius={"xl"}
          >
            {t("Confirm")}
          </Button>
        </Box>
      </Modal>
      <Button
        onClick={open}
        variant="gradient"
        gradient={{ from: "primary", to: "yellow", deg: 90 }}
      >
        {t("Fiat Deposit")}
      </Button>
    </>
  );
}
