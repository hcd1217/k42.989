import BN from "@/common/big-number";
import { OrderSide } from "@/common/enums";
import { profit } from "@/common/logic";
import { COIN_IMAGES } from "@/domain/config";
import useSPETranslation from "@/hooks/useSPETranslation";
import tradeStore from "@/store/trade";
import { CopyPosition } from "@/types";
import NumberFormat from "@/ui/NumberFormat";
import { Box, Flex, Image, SimpleGrid, Text } from "@mantine/core";
import { useMemo } from "react";

export default function PositionBox({
  position,
}: {
  position: CopyPosition;
}) {
  const t = useSPETranslation();
  const { marketInformation } = tradeStore();
  const { color, unRealizedPnl, pnlColor } = useMemo(() => {
    const color = position.side === OrderSide.BUY ? "green" : "red";
    const unRealizedPnl = profit(
      position.entryPrice,
      marketInformation[position.symbol]?.markPrice || 0,
      position.volume,
      position.side,
      position.fee,
    );
    const pnlColor = BN.gt(unRealizedPnl, 0) ? "green" : "red";
    return { color, unRealizedPnl, pnlColor };
  }, [
    marketInformation,
    position.entryPrice,
    position.fee,
    position.side,
    position.symbol,
    position.volume,
  ]);
  return (
    <Box key={position.positionId}>
      <Flex gap={10} align={"center"} mb={"lg"}>
        <Image w={40} h={40} src={COIN_IMAGES[position.symbol]} />
        <Text fw={600} c={color}>
          {position.symbol}
        </Text>
        <Text fw={600} c={color}>
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
            <NumberFormat value={position.margin} decimalPlaces={2} />
          </Text>
        </Box>
        <Box>
          <Text fz={14} c={"dimmed"}>
            {t("Volume")}
          </Text>
          <Text fz={12}>
            <NumberFormat value={position.volume} decimalPlaces={3} />
          </Text>
        </Box>
        <Box>
          <Text fz={14} c={"dimmed"}>
            {t("Unrealized Pnl(%)")}
          </Text>
          <Flex align="center" justify="start" gap={5}>
            <Text fw={600} fz={12} c={pnlColor}>
              <NumberFormat value={unRealizedPnl} decimalPlaces={3} />
            </Text>
            <Text fw={600} fz={12} c={pnlColor}>
              (
              <NumberFormat
                value={BN.div(
                  BN.mul(unRealizedPnl, 100),
                  position.margin,
                )}
                decimalPlaces={3}
                suffix="%"
              />
              )
            </Text>
          </Flex>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
