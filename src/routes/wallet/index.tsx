import BN from "@/common/big-number";
import useSPETranslation from "@/hooks/useSPETranslation";
import { assetStore } from "@/store/assets";
import NumberFormat from "@/ui/NumberFormat";
import { TabsWallet } from "@/ui/Wallet";
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  SimpleGrid,
  Space,
  Text,
} from "@mantine/core";
import { IconHistory } from "@tabler/icons-react";
import { useMemo } from "react";

export default function Wallet() {
  const t = useSPETranslation();
  const { overview, balances, accountById } = assetStore();

  const {
    totalInUsd,
    totalInBtc,
    totalCopyEquity,
    availableInUsd,
    availableInBtc,
    totalCopyEquityInBtc,
  } = useMemo(() => {
    let lockedInUsd = "0",
      lockedInBtc = "0",
      totalCopyEquity = "0",
      totalCopyEquityInBtc = "0";
    balances.forEach((balance) => {
      if (accountById[balance.accountId].type === "SUB") {
        totalCopyEquity = BN.add(totalCopyEquity, balance.equity);
      }
      lockedInBtc = BN.add(lockedInBtc, balance.lockedBtcValue);
      lockedInUsd = BN.add(lockedInUsd, balance.lockedUsdValue);
    });
    if (BN.gt(overview.all?.totalInBtc, "0")) {
      const ratio = BN.div(
        overview.all?.totalInUsd,
        overview.all?.totalInBtc,
      );
      totalCopyEquityInBtc = BN.mul(totalCopyEquity, ratio);
    }
    return {
      totalCopyEquity,
      totalCopyEquityInBtc,
      totalInUsd: overview.all?.totalInUsd || "0",
      totalInBtc: overview.all?.totalInBtc || "0",
      availableInUsd: BN.sub(
        overview.all?.totalInUsd || "0",
        lockedInUsd,
      ),
      availableInBtc: BN.sub(
        overview.all?.totalInBtc || "0",
        lockedInBtc,
      ),
    };
  }, [overview, balances, accountById]);

  return (
    <Container fluid>
      <Box className="space-y-4" py={10}>
        <Space mt={20} />
        <Flex>
          <SimpleGrid
            w="90vw"
            cols={{
              xs: 1,
              sm: 3,
            }}
          >
            <Box>
              <Card
                shadow="0 0 24px 0 rgba(18,18,20,.1)"
                padding="lg"
                radius="25px"
                w={"100%"}
              >
                <Text c={"dimmed"}>{t("Total Equity")}</Text>
                <Flex align={"end"}>
                  <Text fz={24} fw={"bold"}>
                    <NumberFormat
                      decimalPlaces={2}
                      value={totalInUsd}
                    />{" "}
                    <span
                      style={{ fontSize: "14px", fontWeight: "bold" }}
                    >
                      {t("USD")}
                    </span>
                  </Text>
                </Flex>
                <Text c={"dimmed"}>
                  ~{" "}
                  <NumberFormat
                    decimalPlaces={8}
                    value={totalInBtc}
                    zeroAsEmpty
                  />{" "}
                  BTC
                </Text>
              </Card>
            </Box>
            <Box>
              <Card
                shadow="0 0 24px 0 rgba(18,18,20,.1)"
                padding="lg"
                radius="25px"
                w={"100%"}
              >
                <Text c={"dimmed"}>{t("Available Balance")}</Text>
                <Flex align={"end"}>
                  <Text fz={24} fw={"bold"}>
                    <NumberFormat
                      decimalPlaces={2}
                      value={availableInUsd}
                    />{" "}
                    <span
                      style={{ fontSize: "14px", fontWeight: "bold" }}
                    >
                      {t("USD")}
                    </span>
                  </Text>
                </Flex>
                <Text c={"dimmed"}>
                  ~{" "}
                  <NumberFormat
                    decimalPlaces={8}
                    value={availableInBtc}
                    zeroAsEmpty
                  />{" "}
                  BTC
                </Text>
              </Card>
            </Box>
            <Box>
              <Card
                shadow="0 0 24px 0 rgba(18,18,20,.1)"
                padding="lg"
                radius="25px"
                w={"100%"}
              >
                <Text c={"dimmed"}>{t("Total Copy Equity")}</Text>
                <Flex align={"end"}>
                  <Text fz={24} fw={"bold"}>
                    <NumberFormat
                      decimalPlaces={2}
                      value={totalCopyEquity}
                    />{" "}
                    <span
                      style={{ fontSize: "14px", fontWeight: "bold" }}
                    >
                      {t("USD")}
                    </span>
                  </Text>
                </Flex>
                <Text c={"dimmed"}>
                  ~{" "}
                  <NumberFormat
                    decimalPlaces={2}
                    value={totalCopyEquityInBtc}
                    zeroAsEmpty
                  />{" "}
                  BTC
                </Text>
              </Card>
            </Box>
          </SimpleGrid>
          <Box ml={"auto"}>
            <Flex
              align={"right"}
              justify={"end"}
              h={"100%"}
              w={"100%"}
            >
              <Button
                display={"block"}
                fullWidth
                component="a"
                href="/wallet/records/swap"
                variant="gradient"
                gradient={{ from: "primary", to: "yellow", deg: 90 }}
                rightSection={<IconHistory />}
              >
                {t("History")}
              </Button>
            </Flex>
          </Box>
        </Flex>
        <Space mb={20} />
        <Box>
          <TabsWallet />
        </Box>
      </Box>
    </Container>
  );
}
