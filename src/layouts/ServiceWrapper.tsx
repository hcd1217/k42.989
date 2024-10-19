import BRAND from "@/brands";
import { Head } from "@/components/seo";
import useSPEMetadata from "@/hooks/useSPEMetadata";
import appStore from "@/store/app";
import { Footer } from "@/ui/Footer";
import { Header } from "@/ui/Header";
import { Divider } from "@mantine/core";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppWrapper from "./AppWrapper";

export default function ServiceWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { pathname } = useLocation();
  const { data } = useSPEMetadata();

  useEffect(() => {
    appStore.getState().toggleLoading(true);
    setTimeout(() => {
      appStore.getState().toggleLoading(false);
    }, 200);
  }, [pathname]);

  return (
    <AppWrapper>
      <Head title={`${BRAND.configs.APP_NAME}`} />
      <Header metadata={data} />
      {children}
      <Divider />
      <Footer metadata={data} />
    </AppWrapper>
  );
}
