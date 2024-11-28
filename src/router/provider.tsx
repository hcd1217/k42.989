import BRAND from "@/brands";
import { MainErrorFallback } from "@/components/errors/main";
import { useSPEPollingAPIs } from "@/hooks/useSPEPollingAPIs";
import { SPELoading } from "@/ui/SPEMisc";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import imagesLoaded from "imagesloaded";
import React, { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { HelmetProvider } from "react-helmet-async";

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  useSPEPollingAPIs();
  useEffect(() => {
    localStorage.__APP_NAME__ = BRAND.configs.APP_NAME;
  }, []);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    imagesLoaded("#root", function () {
      setLoaded(true);
    });
    return;
  }, []);
  return (
    <MantineProvider
      theme={BRAND.theme}
      cssVariablesResolver={BRAND.resolver}
      defaultColorScheme="dark"
    >
      <Suspense fallback={<SPELoading />}>
        <ErrorBoundary FallbackComponent={MainErrorFallback}>
          <HelmetProvider>
            <ModalsProvider>
              {children}
              {!loaded && <SPELoading />}
            </ModalsProvider>
            <Notifications />
          </HelmetProvider>
        </ErrorBoundary>
      </Suspense>
    </MantineProvider>
  );
};
