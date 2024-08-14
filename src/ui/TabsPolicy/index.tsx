import useSPETranslation from "@/hooks/useSPETranslation";
import { Tabs } from "@mantine/core";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AppText from "../Text/AppText";

export default function TermsServiceWrapper() {
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
          <Tabs.Tab value={"/privacy-policy"}>
            <AppText
              instancetype="TabText"
              component={Link}
              to={"/privacy-policy"}
            >
              {t("Privacy Policy ")}
            </AppText>
          </Tabs.Tab>
          <Tabs.Tab value={"/terms-conditions"}>
            <AppText
              instancetype="TabText"
              component={Link}
              to={"/terms-conditions"}
            >
              {t("Terms and Conditions ")}
            </AppText>
          </Tabs.Tab>

          <Tabs.Tab value={"/risk-disclosure"}>
            <AppText
              instancetype="TabText"
              component={Link}
              to={"/risk-disclosure"}
            >
              {t("Risk Disclosure Statement")}
            </AppText>
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="1">1</Tabs.Panel>
        <Tabs.Panel value="2">2</Tabs.Panel>
        <Tabs.Panel value="3">3</Tabs.Panel>
      </Tabs>
    </>
  );
}
