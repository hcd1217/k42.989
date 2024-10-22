import BRAND from "@/brands";
import { Head } from "@/components/seo";
import { useUser } from "@/hooks/useSPEPollingAPIs";
import { Header } from "@/ui/Header";
import React from "react";

const TradeWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useUser();

  return (
    <>
      <Head title={`${BRAND.configs.APP_NAME}`} />
      <Header />
      {children}
    </>
  );
};

export default TradeWrapper;
