import BRAND from "@/brands";
import { Head } from "@/components/seo";
import { Footer } from "@/ui/Footer";
import { Header } from "@/ui/Header";
import { Divider } from "@mantine/core";
import React from "react";
import { useLocation } from "react-router-dom";
import AppWrapper from "./AppWrapper";

export default function ServiceWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
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
