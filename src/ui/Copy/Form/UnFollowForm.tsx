import BN from "@/common/big-number";
import { OrderSide } from "@/common/enums";
import { profit } from "@/common/logic";
import { COIN_IMAGES } from "@/domain/config";
import useSPETranslation from "@/hooks/useSPETranslation";
import { fetchCopyOpenPositions, unFollowApi } from "@/services/apis";
import tradeStore from "@/store/trade";
import { CopyPosition } from "@/types";
import NumberFormat from "@/ui/NumberFormat";
import { error, success } from "@/utils/notifications";
import { reloadWindow } from "@/utils/utility";
import {
  Box,
  Button,
  Card,
  Flex,
  Image,
  InputLabel,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";

export function UnFollowForm({
  masterAccountId,
  name,
}: {
  name: string;
  masterAccountId: string;
}) {
  const t = useSPETranslation();
  const [positions, setPositions] = useState<CopyPosition[]>([]);
  const { marketInformation } = tradeStore();
  useEffect(() => {
    fetchCopyOpenPositions(masterAccountId).then((positions) =>
      setPositions(positions),
    );
  }, [masterAccountId]);

  return (
    <Box className="space-y-10">
      <Text c={"red"} fz={12} mb={20} fw="bold">
        {t(
          // prettier-ignore
          "Un following copy trading closes all active copied positions, transferring your balance and profits to your Funding Account. To proceed, click \"Confirm\"",
        )}
      </Text>
      {positions.length === 0 ? (
        <></>
      ) : (
        <Box>
          <InputLabel fz={16}>{t("Current Position")}</InputLabel>
          <Card bg="gray.2" p={"lg"}>
            {positions.map((position) => {
              const color =
                position.side === OrderSide.BUY ? "green" : "red";
              const unRealizedPnl = profit(
                position.entryPrice,
                marketInformation[position.symbol]?.markPrice || 0,
                position.volume,
                position.side,
                position.fee,
              );
              return (
                <Box key={position.positionId}>
                  <Flex gap={10} align={"center"} mb={"lg"}>
                    <Image
                      w={40}
                      h={40}
                      src={COIN_IMAGES[position.symbol]}
                    />
                    <Text>{position.symbol}</Text>
                    <Text c={color}>
                      {`${position.side} ${position.leverage}x`}
                    </Text>
                  </Flex>
                  <SimpleGrid cols={2}>
                    <Box>
                      <Text fz={14} c={"dimmed"}>
                        {t("Entry price")}
                      </Text>
                      <Text fz={12}>
                        <NumberFormat
                          value={position.entryPrice}
                          decimalPlaces={2}
                        />
                      </Text>
                    </Box>
                    <Box>
                      <Text fz={14} c={"dimmed"}>
                        {t("Position Margin")}
                      </Text>
                      <Text fz={12}>
                        <NumberFormat
                          value={position.margin}
                          decimalPlaces={2}
                        />
                      </Text>
                    </Box>
                    <Box>
                      <Text fz={14} c={"dimmed"}>
                        {t("Volume")}
                      </Text>
                      <Text fz={12}>
                        <NumberFormat
                          value={position.volume}
                          decimalPlaces={3}
                        />
                      </Text>
                    </Box>
                    <Box>
                      <Text fz={14} c={"dimmed"}>
                        {t("Unrealized Pnl(%)")}
                      </Text>
                      <Text fz={12} c={color}>
                        <NumberFormat
                          value={unRealizedPnl}
                          decimalPlaces={3}
                        />
                      </Text>
                      <Text fz={12} c={color}>
                        <NumberFormat
                          value={BN.div(
                            BN.mul(unRealizedPnl, 100),
                            position.margin,
                          )}
                          decimalPlaces={3}
                          suffix="%"
                        />
                      </Text>
                    </Box>
                  </SimpleGrid>
                </Box>
              );
            })}
          </Card>
        </Box>
      )}
      <Box>
        <Button
          mt={5}
          fullWidth
          onClick={() => {
            unFollowApi(masterAccountId)
              .then(() => {
                success(
                  t("Success"),
                  t("Un-follow %s successfully", name),
                );
              })
              .catch(() => {
                error(
                  t("Something went wrong"),
                  t("Cannot un-follow %s", name),
                );
              })
              .finally(() => {
                modals.closeAll();
                reloadWindow();
              });
          }}
        >
          {t("Confirm")}
        </Button>
      </Box>
    </Box>
  );
}
