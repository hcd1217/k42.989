import BN from "@/common/big-number";
import useSPETranslation from "@/hooks/useSPETranslation";
import { fetchMyCopyInformation } from "@/services/apis";
import tradeStore from "@/store/trade";
import { CopyInformation } from "@/types";
import NumberFormat from "@/ui/NumberFormat";
import {
  ActionIcon,
  Box,
  Card,
  Container,
  Divider,
  Flex,
  SimpleGrid,
  Space,
  Text,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import {
  IconArrowsHorizontal,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";

export function FollowerInformation() {
  const t = useSPETranslation();
  const [hidden, toggle] = useToggle([false, true]);
  const [isUsdt, toggleUsdt] = useToggle([true, false]);
  const [information, setInformation] = useState<CopyInformation>();
  useEffect(() => {
    fetchMyCopyInformation().then((information) => {
      setInformation(information);
    });
  }, []);

  const { netPnL, total } = useMemo(() => {
    const total = information?.total || 0;
    const netPnL = information?.netPnL || 0;
    if (isUsdt) {
      return { total, netPnL };
    }
    const price =
      tradeStore.getState().marketPrices["BTC_USDT_SPOT"] || 0;
    return {
      total: Number(BN.div(total, price)),
      netPnL: Number(BN.div(netPnL, price)),
    };
  }, [information?.netPnL, information?.total, isUsdt]);

  return (
    <>
      <Container fluid>
        <Card
          shadow="0 0 24px 0 rgba(18,18,20,.1)"
          padding="xl"
          radius="25px"
          w={"100%"}
        >
          <Flex
            gap={40}
            align={"center"}
            wrap={{
              xs: "wrap",
              sm: "nowrap",
            }}
          >
            <Box>
              <Flex>
                <Text>{t("Total Assets")}</Text>
                <ActionIcon
                  variant="transparent"
                  onClick={() => toggle()}
                >
                  <Box hidden={hidden}>
                    <IconEye size={18} color="gray" />
                  </Box>
                  <Box hidden={!hidden}>
                    <IconEyeOff size={18} color="gray" />
                  </Box>
                </ActionIcon>
              </Flex>
              <Flex align={"end"}>
                <Text fz={30} fw={"bold"} miw={160}>
                  <NumberFormat
                    hidden={hidden}
                    decimalPlaces={2}
                    value={total}
                  />{" "}
                  <span
                    style={{ fontSize: "30px", fontWeight: "normal" }}
                  >
                    {isUsdt ? "USDT" : "BTC"}
                  </span>
                </Text>
                <Box>
                  <ActionIcon
                    variant="transparent"
                    onClick={() => toggleUsdt()}
                  >
                    <IconArrowsHorizontal />
                  </ActionIcon>
                </Box>
              </Flex>
              <Text c={"dimmed"}>
                ≈
                <NumberFormat
                  prefix="$"
                  hidden={hidden}
                  decimalPlaces={2}
                  value={information?.total || 0}
                />{" "}
              </Text>
            </Box>
            <Flex visibleFrom="sm" align={"center"}>
              <Divider orientation="vertical" h={74} />
            </Flex>
            <Box>
              <Flex>
                <Text>{t("Net PnL")}</Text>
              </Flex>
              <Flex align={"end"}>
                <Text fz={30} fw={"bold"} miw={160}>
                  <NumberFormat
                    hidden={hidden}
                    decimalPlaces={2}
                    value={netPnL}
                  />{" "}
                  <span
                    style={{ fontSize: "30px", fontWeight: "normal" }}
                  >
                    {isUsdt ? "USDT" : "BTC"}
                  </span>
                </Text>
              </Flex>
              <Text c={"dimmed"}>
                ≈
                <NumberFormat
                  prefix="$"
                  hidden={hidden}
                  decimalPlaces={2}
                  value={information?.netPnL || 0}
                />{" "}
              </Text>
            </Box>
          </Flex>
          <Space mb={"xl"} />
          <SimpleGrid
            cols={{
              xs: 1,
              sm: 2,
              md: 5,
            }}
          >
            <Box>
              <Text fz={14} c={"dimmed"}>
                {t("Unrealized PnL")}
              </Text>
              <Flex align={"center"} gap={5}>
                <Text fz={16} fw={600}>
                  <NumberFormat
                    hidden={hidden}
                    value={information?.unRealizedPnl || 0}
                    decimalPlaces={2}
                  />
                </Text>
                {BN.gt(information?.total || 0, 0) && (
                  <Text fz={14} fw={600}>
                    (
                    <NumberFormat
                      hidden={hidden}
                      suffix="%"
                      decimalPlaces={2}
                      value={BN.div(
                        BN.mul(information?.unRealizedPnl || 0, 100),
                        information?.total || 1,
                      )}
                    />
                    )
                  </Text>
                )}
              </Flex>
            </Box>
            <Box>
              <Text fz={14} c={"dimmed"}>
                {t("Available Balance (USDT)")}
              </Text>
              <Flex align={"center"} gap={5}>
                <Text fz={16} fw={600}>
                  <NumberFormat
                    hidden={hidden}
                    value={information?.available || 0}
                    decimalPlaces={2}
                  />
                </Text>
              </Flex>
            </Box>
            <Box>
              <Text fz={14} c={"dimmed"}>
                {t("Withdrawable (USDT)")}
              </Text>
              <Flex align={"center"} gap={5}>
                <Text fz={16} fw={600}>
                  <NumberFormat
                    hidden={hidden}
                    value={information?.withDrawable || 0}
                    decimalPlaces={2}
                  />
                </Text>
              </Flex>
            </Box>
            <Box>
              <Text fz={14} c={"dimmed"}>
                {t("Settled Profit Sharing")}
              </Text>
              <Flex align={"center"} gap={5}>
                <Text fz={16} fw={600}>
                  <NumberFormat
                    hidden={hidden}
                    value={information?.settled || 0}
                    decimalPlaces={2}
                  />
                </Text>
              </Flex>
            </Box>
            <Box>
              <Text fz={14} c={"dimmed"}>
                {t("Unsettled Profit Sharing")}
              </Text>
              <Flex align={"center"} gap={5}>
                <Text fz={16} fw={600}>
                  <NumberFormat
                    hidden={hidden}
                    value={information?.unSettled || 0}
                    decimalPlaces={2}
                  />
                </Text>
              </Flex>
            </Box>
          </SimpleGrid>
        </Card>
      </Container>
    </>
  );
}
