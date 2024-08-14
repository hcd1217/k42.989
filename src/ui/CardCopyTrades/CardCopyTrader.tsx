import trade_icon from "@/assets/images/trade_icon.png";
import useSPETranslation from "@/hooks/useSPETranslation";
import { CopyMaster } from "@/types";
import { valueColor } from "@/utils/utility";
import {
  Avatar,
  Box,
  Card,
  Flex,
  Group,
  Image,
  Space,
  Tooltip,
} from "@mantine/core";
import { IconCaretUpFilled } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import AppButton from "../Button/AppButton";
import AppChart from "../Chart/Chart";
import AppText from "../Text/AppText";
import classes from "./index.module.scss";

export function CardTrader(trader: CopyMaster) {
  const t = useSPETranslation();
  const navigate = useNavigate();
  return (
    <Card
      className={classes.card}
      p={20}
      radius={8}
      pos={"relative"}
      component={Link}
      to={`/copy-trading/${trader.masterAccountId}`}
    >
      <Box>
        <Box>
          <Group wrap="nowrap">
            <Avatar size={60} src={trader.avatar} />
            <Box>
              <Flex align={"center"} gap={5}>
                <AppText
                  fz={20}
                  fw={"bolder"}
                  lineClamp={1}
                  title={trader.name}
                >
                  {" "}
                  {trader.name}
                </AppText>
                <Image w={20} src={trade_icon} />
              </Flex>
              <Space my={5} />
              <Flex gap={10}>
                <AppText instancetype="withTheadSmall">
                  {trader.followers} Follower(s)
                </AppText>
                <Flex align={"center"}>
                  <IconCaretUpFilled color="#20b26c" size={16} />
                  <AppText instancetype="withTheadSmall" c={"dark"}>
                    {_value(trader.pnlRatio)}
                  </AppText>
                </Flex>
              </Flex>
            </Box>
          </Group>
        </Box>
        <Flex align={"center"} justify={"space-between"}>
          <Box>
            <Tooltip
              multiline
              w={220}
              withArrow
              c={"dark"}
              bg={"gray.4"}
              p={20}
              transitionProps={{ duration: 200 }}
              label={t(
                "Expressed as a percentage and calculated by dividing an investment's net profit (or loss) by its initial cost. ROI is a performance measure used to evaluate the efficiency or profitability of an investment.",
              )}
            >
              <AppButton variant="transparent" p={0} m={0} h={"auto"}>
                <AppText instancetype="withTheadSmall">
                  ROI{" "}
                  <span
                    style={{
                      border: "solid 1px #adb1b8",
                      borderRadius: "4px",
                      zoom: "0.83",
                      padding: "0 4.2px",
                    }}
                  >
                    All
                  </span>
                </AppText>
              </AppButton>
            </Tooltip>
            <AppText
              instancetype="withPriceCardTrade"
              c={valueColor(trader.roi)}
            >
              {_value(trader.roi)}
            </AppText>
          </Box>
          <AppChart
            instancetype="Sparkline" // cspell:ignore Areapercent
            chartSeries={[
              {
                name: "series1",
                data: trader.series,
              },
            ]}
            chartOptions={{
              colors: [trader.roi > 0 ? "#00E396" : "#ff0000"],
              fill: {
                opacity: 0.4,
                colors: [trader.roi > 0 ? "#00E396" : "#ff0000"],
              },
            }}
          />
        </Flex>
        <Flex justify={"space-between"}>
          <Tooltip
            multiline
            w={220}
            withArrow
            c={"dark"}
            bg={"gray.4"}
            p={20}
            transitionProps={{ duration: 200 }}
            label={t(
              "Expressed as a percentage and calculated by dividing an investment's net profit (or loss) by its initial cost. ROI is a performance measure used to evaluate the efficiency or profitability of an investment.",
            )}
          >
            <AppButton variant="transparent" p={0} m={0} h={"auto"}>
              <AppText instancetype="withTheadSmall">
                ROI{" "}
                <span
                  style={{
                    border: "solid 1px #adb1b8",
                    borderRadius: "4px",
                    zoom: "0.83",
                    padding: "0 4.2px",
                  }}
                >
                  90d
                </span>
              </AppText>
            </AppButton>
          </Tooltip>
          <AppText
            instancetype="withPriceCardTrade"
            c={valueColor(trader.roi90d)}
          >
            {_value(trader.roi90d)}
          </AppText>
        </Flex>
        <Flex justify={"space-between"}>
          <Tooltip
            multiline
            w={220}
            withArrow
            c={"dark"}
            bg={"gray.4"}
            p={20}
            transitionProps={{ duration: 200 }}
            label={t(
              "The maximum observed loss for the Master Trader in the last 30 days. A low maximum drawdown indicates that the loss incurred by the Master Trader's trades is relatively small.",
            )}
          >
            <AppButton variant="transparent" p={0} m={0} h={"auto"}>
              <AppText instancetype="withTheadSmall">
                {t("Drawdown")}{" "}
                <span
                  style={{
                    border: "solid 1px #adb1b8",
                    borderRadius: "4px",
                    zoom: "0.83",
                    padding: "0 4.2px",
                  }}
                >
                  30d
                </span>
              </AppText>
            </AppButton>
          </Tooltip>
          <AppText
            instancetype="withPriceCardTrade"
            c={valueColor(-trader.drawDown)}
          >
            {_value(-trader.drawDown, "")}
          </AppText>
        </Flex>
        <Flex justify={"space-between"}>
          <Tooltip
            multiline
            w={220}
            withArrow
            c={"dark"}
            bg={"gray.4"}
            p={20}
            transitionProps={{ duration: 200 }}
            label="Assets Under Management (AUM) is the total amount of investments from followers, managed by the Master Trader."
          >
            <AppButton variant="transparent" p={0} m={0} h={"auto"}>
              <AppText instancetype="withTheadSmall">AUM</AppText>
            </AppButton>
          </Tooltip>
          <AppText instancetype="withPriceCardTrade">
            {trader.aum ? trader.aum.toLocaleString() : "---"}
          </AppText>
        </Flex>
        <Space h={20} />
        <AppButton
          variant="gradient"
          fullWidth
          gradient={{ from: "primary", to: "yellow", deg: 90 }}
          onClick={() =>
            navigate(`/copy-trading/${trader.masterAccountId}`)
          }
        >
          {t("Copy")}
        </AppButton>
      </Box>
    </Card>
  );
}

function _value(percent: number, suffix = "%") {
  return `${
    percent > 0 ? "+" : ""
  }${percent.toLocaleString()}${suffix}`;
}
