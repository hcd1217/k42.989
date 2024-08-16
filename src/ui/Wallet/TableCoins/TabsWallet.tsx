import useSPETranslation from "@/hooks/useSPETranslation";
import MyTraders from "@/routes/copy/my-traders";
import logger from "@/services/logger";
import { assetStore } from "@/store/assets";
import authStore from "@/store/auth";
import AppTabs from "@/ui/Tabs";
import AppText from "@/ui/Text/AppText";
import { Box, Checkbox, Flex } from "@mantine/core";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { FiatDepositModal } from "./FiatDepositModal";
import { FundAssetsTable } from "./FundAssetsTable";
import { TradingAssetsTable } from "./TradingAssetsTable";
export function TabsWallet() {
  const { me } = authStore();
  const [hideZero, setHideZero] = useState(false);
  const { masterTraders } = assetStore();
  const { hash } = useLocation();
  logger.debug("TabsWallet", { hash }, hash?.slice(1));
  const t = useSPETranslation();
  return (
    <>
      <Box pos={"relative"}>
        <Box h={42} hiddenFrom="sm">
          <Flex align={"center"} gap={20}>
            <Checkbox
              defaultChecked={hideZero}
              label={t("Hide small balances")}
              onChange={() => setHideZero(!hideZero)}
            />
            {me?.fiatDepositMemo && <FiatDepositModal />}
          </Flex>
        </Box>
        <AppTabs
          className="noBg"
          value={hash?.slice(1) || "funding"}
          onChange={(value) => {
            value && (window.location.hash = value);
          }}
          showPanel
          classNames={{
            root: "tabBorderSmall",
          }}
          styles={{
            tabLabel: {
              fontWeight: "bolder",
              fontSize: "20px",
            },
          }}
          tabs={[
            {
              data: {
                label: (
                  <>
                    <AppText
                      instancetype="TabText"
                      fz={{
                        xs: "16px",
                        md: "20px",
                      }}
                    >
                      {t("Funding Account")}
                    </AppText>
                  </>
                ),
                value: "funding",
              },
              tabsPanelProps: {
                childrenRenderer: () => (
                  <FundAssetsTable hideZero={hideZero} />
                ),
                value: "funding",
              },
            },
            {
              data: {
                label: (
                  <>
                    {
                      <AppText
                        instancetype="TabText"
                        fz={{
                          xs: "16px",
                          md: "20px",
                        }}
                      >
                        {me?.isCopyMaster
                          ? t("Copy Master Account")
                          : t("Trading Account")}
                      </AppText>
                    }
                  </>
                ),
                value: "trading",
              },
              tabsPanelProps: {
                childrenRenderer: () => (
                  <TradingAssetsTable hideZero={hideZero} />
                ),
                value: "trading",
              },
            },
            {
              hidden: masterTraders.length < 1,
              data: {
                label: (
                  <>
                    {
                      <AppText
                        instancetype="TabText"
                        fz={{
                          xs: "16px",
                          md: "20px",
                        }}
                      >
                        {t("Copy Accounts")}
                      </AppText>
                    }
                  </>
                ),
                value: "copy",
              },
              tabsPanelProps: {
                childrenRenderer: () => <MyTraders />,
                value: "copy",
              },
            },
          ].filter((el) => !el.hidden)}
        />
        <Box
          h={42}
          pos={"absolute"}
          right={0}
          top={0}
          visibleFrom="sm"
        >
          <Flex align={"center"} gap={20}>
            <Checkbox
              defaultChecked={hideZero}
              label={t("Hide small balances")}
              onChange={() => setHideZero(!hideZero)}
            />
            {me?.fiatDepositMemo && <FiatDepositModal />}
          </Flex>
        </Box>
      </Box>
    </>
  );
}
