import BRAND from "@/brands";
import { Head } from "@/components/seo";
import useSPEMetadata from "@/hooks/useSPEMetadata";
import { CopyInformation, Tabs } from "@/ui/Copy";
import TabControl from "@/ui/Copy/TabControl";
import { Header } from "@/ui/Header";
import { Box, Card, Container, Space } from "@mantine/core";
import React, { useEffect, useState } from "react";

const CopyTradeWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data } = useSPEMetadata();
  const [, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Head title={`${BRAND.configs.APP_NAME} | Copy traders`} />

      <Header metadata={data} />
      <Space mb={"xl"} />
      <TabControl />
      <Space mb={"xl"} />
      <CopyInformation />
      <Space mb={"xl"} />
      <Container fluid>
        <Card
          shadow="0 0 24px 0 rgba(18,18,20,.1)"
          padding="xl"
          radius="25px"
          w={"100%"}
        >
          <Tabs />
          <Box>{children}</Box>
        </Card>
      </Container>
    </>
  );
};

export default CopyTradeWrapper;
