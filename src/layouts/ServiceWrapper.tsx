import BRAND from "@/brands";
import { Head } from "@/components/seo";
import { useUser } from "@/hooks/useSPEPollingAPIs";
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
  useUser();
  useEffect(() => {
    appStore.getState().toggleLoading(true);
    setTimeout(() => {
      appStore.getState().toggleLoading(false);
    }, 500);
  }, [pathname]);
  return (
    <AppWrapper>
      <Head title={`${BRAND.configs.APP_NAME}`} />
      <Header />
      {children}
      <Divider />
      <Footer />
    </AppWrapper>
  );
}
