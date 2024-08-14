import useSPETranslation from "@/hooks/useSPETranslation";
import authStore from "@/store/auth";
import AppTabs from "@/ui/Tabs";
import { useCallback, useEffect, useState } from "react";
import {
  matchPath,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { DepositRecords } from "./DepositRecords";
import { OtherRecords } from "./OtherRecords";
import { SwapRecords } from "./SwapRecords";
import { WithdrawRecords } from "./WithdrawRecords";

export function Tabs() {
  const { me } = authStore();

  const t = useSPETranslation();
  const [tab, setTab] = useState<string | null>("swap");
  const navigate = useNavigate();
  const location = useLocation();

  const setTabByRoute = useCallback(() => {
    const f = location.pathname.split("/");
    const tab = f[f.length - 1];
    const isIndex = Boolean(
      matchPath("/wallet/records", location.pathname)?.pattern,
    );
    setTab(isIndex ? "swap" : tab);
  }, [location.pathname]);

  useEffect(() => {
    setTabByRoute();
  }, [setTabByRoute]);

  const onChangeTab = useCallback(
    (t: string | null) => {
      // setTab(t)
      navigate(`/wallet/records/${t?.toLowerCase()}`, {
        replace: true,
      });
    },
    [navigate],
  );

  return (
    <>
      <AppTabs
        className="noBg"
        value={tab}
        showPanel={false}
        onChange={onChangeTab}
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
              label: t("Swap"),
              value: "swap",
            },
            tabsPanelProps: {
              childrenRenderer: () => <SwapRecords />,
              value: "swap",
            },
          },
          {
            data: {
              label: t("Deposit"),
              value: "deposit",
            },
            tabsPanelProps: {
              childrenRenderer: () => <DepositRecords />,
              value: "deposit",
            },
          },
          {
            data: {
              label: t("Withdraw"),
              value: "withdraw",
            },
            tabsPanelProps: {
              childrenRenderer: () => <WithdrawRecords />,
              value: "withdraw",
            },
          },
          {
            skip: Boolean(!me?.fiatDepositMemo),
            data: {
              label: t("Fiat Deposit"),
              value: "fiat-deposit",
            },
            tabsPanelProps: {
              childrenRenderer: () => <WithdrawRecords />,
              value: "fiat-deposit",
            },
          },
          {
            data: {
              label: t("Others"),
              value: "others",
            },
            tabsPanelProps: {
              childrenRenderer: () => <OtherRecords />,
              value: "others",
            },
          },
        ].filter((i) => !i.skip)}
      />
    </>
  );
}
