import BRAND from "@/brands";
import { Head } from "@/components/seo";
import { Header } from "@/ui/Header";
import { Box } from "@mantine/core";
import React from "react";
const AssetWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <Head title={`${BRAND.configs.APP_NAME} | Assets`} />
      <Header />
      <Box h={"100%"}>{children}</Box>
    </>
  );
};

export default AssetWrapper;
