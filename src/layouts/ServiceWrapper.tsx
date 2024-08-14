import useSPEMetadata from "@/hooks/useSPEMetadata";
import appStore from "@/store/app";
import { Header } from "@/ui/Header";
import { Divider } from "@mantine/core";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppWrapper from "./AppWrapper";
import { Footer } from "@/ui/Footer";

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
      <Header metadata={data} />
      {children}
      <Divider />
      <Footer metadata={data} />
    </AppWrapper>
  );
}
