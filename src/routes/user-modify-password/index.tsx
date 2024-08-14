import useSPETranslation from "@/hooks/useSPETranslation";
import { UserChangePasswordForm } from "@/ui/Profile";
import { Anchor, Box, Breadcrumbs, Container } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";

// TODO: rename this component to match the file name
export default function Page() {
  const t = useSPETranslation();
  return (
    <>
      <Container>
        <Breadcrumbs
          my={20}
          separator={<IconChevronRight color="gray" size={14} />}
        >
          <Anchor fz={16} fw={400} href="/user">
            {t("My Account")}
          </Anchor>
          <Anchor fz={16} fw={400}>
            {t("Change Password")}
          </Anchor>
        </Breadcrumbs>
        <Box h={"calc(100vh - 200px)"}>
          <UserChangePasswordForm />
        </Box>
      </Container>
    </>
  );
}
