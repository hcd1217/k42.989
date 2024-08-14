import useSPETranslation from "@/hooks/useSPETranslation";
import AppText from "@/ui/Text/AppText";
import { Tabs } from "@mantine/core";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function ServiceWrapper() {
  const t = useSPETranslation();
  const l = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <Tabs
        defaultValue={l.pathname}
        onChange={(v) => {
          navigate(v as string);
        }}
      >
        <Tabs.List>
          <Tabs.Tab value={"/induction"}>
            <AppText
              instancetype="TabText"
              component={Link}
              to={"/referral-program"}
            >
              {t("Beginner's Guide for Copy Trading Referrals")}
            </AppText>
          </Tabs.Tab>
          <Tabs.Tab value={"/referral-program"}>
            <AppText
              instancetype="TabText"
              component={Link}
              to={"/referral-program"}
            >
              {t("Crypto Copy Invest Referral Program")}
            </AppText>
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="1">1</Tabs.Panel>
        <Tabs.Panel value="2">2</Tabs.Panel>
      </Tabs>
    </>
  );
}
