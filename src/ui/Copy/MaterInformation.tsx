import BN from "@/common/big-number";
import { MODAL_STYLES } from "@/domain/config";
import useSPETranslation from "@/hooks/useSPETranslation";
import { fetchMyMasterDetail } from "@/services/apis";
import tradeStore from "@/store/trade";
import { CopyMasterDetail } from "@/types";
import { MasterSettingForm } from "@/ui/Copy";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Container,
  Flex,
  SimpleGrid,
  Space,
  Text,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import {
  IconArrowsHorizontal,
  IconEye,
  IconEyeOff,
  IconSettings,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import NumberFormat from "../NumberFormat";

export function MaterInformation() {
  const t = useSPETranslation();
  const [hidden, toggle] = useToggle([false, true]);
  const [isUsdt, toggleUsdt] = useToggle([true, false]);
  const [information, setInformation] = useState<CopyMasterDetail>();
  useEffect(() => {
    fetchMyMasterDetail().then((information) => {
      setInformation(information);
    });
  }, []);

  const totalProfitSharing = useMemo(() => {
    const value = information?.profitSharing.total || 0;
    if (isUsdt) {
      return value;
    }
    const price =
      tradeStore.getState().marketPrices["BTC_USDT_SPOT"] || 0;
    return Number(BN.div(value, price));
  }, [isUsdt, information?.profitSharing.total]);

  return (
    <Container fluid>
      <Card
        shadow="0 0 24px 0 rgba(18,18,20,.1)"
        padding="xl"
        radius="25px"
        w={"100%"}
      >
        <Flex justify={"space-between"}>
          <Flex
            gap={30}
            align={"center"}
            wrap={{
              xs: "wrap",
              sm: "nowrap",
            }}
          >
            <Box>
              <Flex>
                <Text>{t("Est. Total Profit Sharing")}</Text>
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
                    value={totalProfitSharing}
                  />{" "}
                  <span
                    style={{
                      fontSize: "30px",
                      fontWeight: "normal",
                    }}
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
                  value={information?.profitSharing.total || 0}
                />{" "}
              </Text>
            </Box>
            <SimpleGrid
              cols={{
                xs: 1,
                sm: 2,
              }}
              styles={{
                root: {
                  gap: 10,
                },
              }}
            >
              <Box
                bg={"gray.2"}
                p={"5px 10px"}
                style={{ borderRadius: "5px" }}
              >
                <Text>
                  {t("Master Profit Sharing")}:
                  {information?.shares.master}%
                </Text>
              </Box>
            </SimpleGrid>
          </Flex>
          <Button
            onClick={() => {
              information &&
                modals.open({
                  ...MODAL_STYLES,
                  styles: {
                    title: MODAL_STYLES.styles.title,
                    body: {
                      marginTop: 20,
                    },
                    header: {
                      display: "none",
                    },
                  },
                  children: (
                    <MasterSettingForm information={information} />
                  ),
                });
            }}
            variant="gradient"
            gradient={{ from: "primary", to: "yellow", deg: 90 }}
            justify="space-between"
            leftSection={
              <>
                <IconSettings />
              </>
            }
          >
            {t("My Setting")}
          </Button>
        </Flex>
        <Space mb={"xl"} />
        <SimpleGrid
          cols={{
            xs: 1,
            sm: 3,
            md: 6,
          }}
        >
          <Box>
            <Text fz={14} c={"dimmed"}>
              {t("Settlement Method")}
            </Text>
            <Text fz={16} fw={600}>
              {t("High-Water Mark")}
            </Text>
          </Box>
          <Box>
            <Text fz={14} c={"dimmed"}>
              {t("Curr. Followers")}
            </Text>
            <Flex align={"center"} gap={5}>
              <Text fz={16} fw={600}>
                <NumberFormat
                  hidden={hidden}
                  value={information?.followers.current || 0}
                  decimalPlaces={0}
                />
              </Text>
              /
              <Text fz={14} fw={600}>
                <NumberFormat
                  hidden={hidden}
                  value={information?.followers.max || 0}
                  decimalPlaces={0}
                />
              </Text>
            </Flex>
          </Box>
          <Box>
            <Text fz={14} c={"dimmed"}>
              {t("Follower’s AUM")}
            </Text>
            <Flex align={"center"} gap={5}>
              <Text fz={16} fw={600}>
                <NumberFormat
                  hidden={hidden}
                  value={information?.followers.aum || 0}
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
                  value={information?.profitSharing.settled || 0}
                  decimalPlaces={2}
                  suffix="USDT"
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
                  value={information?.profitSharing.unSettled || 0}
                  decimalPlaces={2}
                  suffix="USDT"
                />
              </Text>
            </Flex>
          </Box>
        </SimpleGrid>
      </Card>
    </Container>
  );
}
