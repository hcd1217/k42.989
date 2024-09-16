import useSPETranslation from "@/hooks/useSPETranslation";
import { KYCVerifyStatus } from "@/ui/Profile/Forms/KYCVerifyStatus";
import {
  Anchor,
  Breadcrumbs,
  Card,
  Container,
  Space,
  Title,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";

// TODO: rename this component to match the file name
export default function Page() {
  const t = useSPETranslation();
  return (
    <>
      <Container>
        {/* {location.pathname} */}
        <Breadcrumbs
          my={20}
          separator={<IconChevronRight color="gray" size={14} />}
        >
          <Anchor fz={16} fw={400} href="/user">
            {t("My Account")}
          </Anchor>
          <Anchor fz={16} fw={400}>
            {t("KYC Verification")}
          </Anchor>
        </Breadcrumbs>
        <Card
          p={"32px"}
          shadow="0 0 24px 0 rgba(18,18,20,.1)"
          padding="xs"
          radius="25px"
          maw={"75vw"}
          w={"100%"}
          mx={"auto"}
        >
          <Title order={2}>Verification steps</Title>
          <Space my={"sm"} />
          <KYCVerifyStatus />
          <Space my={"md"} />
        </Card>
      </Container>
    </>
  );
}
