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
            {t("Transfer request")}
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
              最低入金額は10
              USDTです。この金額を下回る入金額は入金されません。
            </Text>
          </Alert>
        </Box>
        <Text fw={"bold"}>以下の手続きにご注意ください:</Text>
        <ul
          style={{
            padding: "0 20px",
            overflow: "scroll",
            maxHeight: 200,
          }}
        >
          <li>
            <Text fz={14}>
              <strong></strong>{" "}
              <strong>
                お振込みの際は4桁のコード番号を振込人名義の前にご入力ください【
                4桁のコード番号＋振込人名】：
              </strong>
              銀行振込の際に4桁のコード番号を入力しなかった場合、またはコード番号の記入場所を間違えてしまった場合などは、すぐにカスタマーサービスまでご連絡ください。
            </Text>
          </li>
          <li>
            <Text fz={14}>
              現地通貨でのご入金は、お支払い時の為替レートに基づいてUSDTに換算されます。法定通貨（円）からUSDTへの変換は、為替レートの変動（Investing.comから引用）の対象となり、一定の手数料が含まれます。
              {localStorage.__APP_NAME__}
              は、フィアットからUSDTへの変換サービスに関する修正または最終的な解釈の権利を保有します。ご了承ください。
            </Text>
          </li>
          <li>
            <Text fz={14}>資金は1営業日以内に入金されます。</Text>
          </li>
          <li>
            この決済方法は日本国外の銀行からの送金には対応しておりません。
          </li>
          <li>
            300万円を超えるお取引の場合、当社のコンプライアンスチームによる審査と承認が必要となる場合があります。その結果、処理時間が長くなる可能性があります。この期間はご容赦ください。一度にご入金いただけるのは1回のみです。次の入金は、前の入金が処理された後にのみ行うことができます。
          </li>
          <li>
            <Text fz={14}>
              マネーロンダリングを防止するため、入金から1週間が経過し、少なくとも1回の取引が行われない限り、出金手続きは行われません。
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
