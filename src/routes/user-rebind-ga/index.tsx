import useSPETranslation from "@/hooks/useSPETranslation";
import authStore from "@/store/auth";
import { ReBindGaForm } from "@/ui/Profile/Forms/ReBindGaForm";
import { Anchor, Breadcrumbs, Container } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// TODO: rename this component to match the file name
export default function Page() {
  const t = useSPETranslation();
  const navigate = useNavigate();
  const { me } = authStore();
  useEffect(() => {
    if (me?.hasMfa === false) {
      navigate("/user/bind-ga");
    }
  }, [me?.hasMfa, navigate]);

  return (
    <>
      <Container>
        <Breadcrumbs
          my={20}
          separator={<IconChevronRight color="gray" size={14} />}
        >
          <Anchor component={Link} fz={16} fw={400} to="/user">
            {t("My Account")}
          </Anchor>
          <Anchor fz={16} fw={400}>
            {t("Change GA")}
          </Anchor>
        </Breadcrumbs>
        <ReBindGaForm />
      </Container>
    </>
  );
}
