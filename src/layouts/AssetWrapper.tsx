import BRAND from "@/brands";
import { Head } from "@/components/seo";
import useSPEMetadata from "@/hooks/useSPEMetadata";
import { Header } from "@/ui/Header";
import { Box } from "@mantine/core";
import React from "react";
const AssetWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data } = useSPEMetadata();
  return (
    <>
      <Head title={`${BRAND.configs.APP_NAME} | Assets`} />
      <Header metadata={data} />
      <Box h={"100%"}>{children}</Box>
    </>
  );
};

export default AssetWrapper;
