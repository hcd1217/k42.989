import useSPETranslation from "@/hooks/useSPETranslation";
import authStore from "@/store/auth";
import { BindGaForm } from "@/ui/Profile";
import { Anchor, Breadcrumbs, Container } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// TODO: rename this component to match the file name
export default function Page() {
  const t = useSPETranslation();
  const navigate = useNavigate();
  const { me } = authStore();
  useEffect(() => {
    if (me?.hasMfa === true) {
      navigate("/user/rebind-ga");
    }
  }, [me?.hasMfa, navigate]);
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
            {t("Change GA")}
          </Anchor>
        </Breadcrumbs>
        <BindGaForm />
      </Container>
    </>
  );
}
