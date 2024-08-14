import tradeIcon from "@/assets/images/trade_icon.png";
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

const images = [
  "/images/tops/top_1.png",
  "/images/tops/top_2.png",
  "/images/tops/top_3.png",
  "/images/tops/top_4.png",
  "/images/tops/top_5.png",
];

const colors = [
  "rgba(194,137,0,.3)",
  "#d2daea",
  "#e6c29d",
  "#d5dae0",
  "#d5dae0",
];

export function CardTraderTop1({
  ranking,
  avatar,
  name,
  pnlRatio,
  masterAccountId,
  followers,
  roi,
  roi90d,
  drawDown,
  aum,
  series,
}: CopyMaster) {
  const t = useSPETranslation();
  const navigate = useNavigate();

  return (
    <Card
      className={classes.card}
      radius={8}
      w={320}
      p={20}
      pos={"relative"}
      component={Link}
      to={`/copy-trading/${masterAccountId}`}
    >
      {ranking < 6 && (
        <Box pos={"absolute"} top={0} left={0} style={{ zIndex: 2 }}>
          <Image src={images[ranking - 1]} />
        </Box>
      )}
      <Box pos={"absolute"} top={36} left={19} style={{ zIndex: 1 }}>
        <Avatar size={80} src={avatar} />
      </Box>
      <Box
        pos={"absolute"}
        top={0}
        w={88}
        h={40}
        right={0}
        style={{
          borderRadius: "0 8px 0 24px",
          background: colors[ranking - 1],
          zIndex: 3,
        }}
      >
        <AppText
          fz={20}
          fw={600}
          lh={"40px"}
          c={"white"}
          style={{ textAlign: "center" }}
        >
          No. {ranking.toString().padStart(2, "0")}
        </AppText>
      </Box>
      <Box pos={"relative"} style={{ zIndex: 3 }}>
        <Box style={{}} mt={24}>
          <Group wrap="nowrap">
            <Avatar opacity={0} size={80} src={avatar} />
            <Box>
              <Flex align={"center"} gap={5}>
                <AppText
                  fz={20}
                  fw={"bolder"}
                  c={"dark"}
                  lineClamp={1}
                  title={name}
                >
                  {` ${name} `}
                </AppText>
                <Image w={20} src={tradeIcon} />
              </Flex>
              <Space my={5} />
              <Flex
                gap={10}
                styles={{
                  root: { whiteSpace: "nowrap" }
                }}
              >
                <AppText instancetype="withTheadSmall" c={"dark"}>
                  {followers} Follower(s)
                </AppText>
                <Flex align={"center"}>
                  <IconCaretUpFilled color="#20b26c" size={16} />
                  <AppText instancetype="withTheadSmall" c={"dark"}>
                    {_value(pnlRatio)}
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
              c={valueColor(roi)}
            >
              {_value(roi)}
            </AppText>
          </Box>
          <AppChart
            instancetype="Sparkline" // cspell:disable-line
            chartSeries={[
              {
                name: "pnl",
                data: series.map((el) => {
                  return el * 100;
                }),
              },
            ]}
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
            c={valueColor(roi90d)}
          >
            {roi90d ? _value(roi90d) : "---"}
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
            c={valueColor(-drawDown)}
          >
            {_value(-drawDown, "")}
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
            {aum ? aum.toLocaleString() : "---"}
          </AppText>
        </Flex>
        <Space h={20} />
        <AppButton
          variant="gradient"
          fullWidth
          gradient={{ from: "primary", to: "yellow", deg: 90 }}
          onClick={() => navigate(`/copy-trading/${masterAccountId}`)}
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
