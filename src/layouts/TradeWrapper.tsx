import BRAND from "@/brands";
import { Head } from "@/components/seo";
import useSPEMetadata from "@/hooks/useSPEMetadata";
import { useUser } from "@/hooks/useSPEPollingAPIs";
import { Header } from "@/ui/Header";
import React from "react";

const TradeWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data } = useSPEMetadata();
  useUser();

  return (
    <>
      <Head title={`${BRAND.configs.APP_NAME}`} />
      <Header metadata={data} />
      {children}
    </>
  );
};

export default TradeWrapper;
