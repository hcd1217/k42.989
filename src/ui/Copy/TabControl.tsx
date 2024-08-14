import useSPETranslation from "@/hooks/useSPETranslation";
import authStore from "@/store/auth";
import {
  Center,
  Container,
  rem,
  SegmentedControl,
} from "@mantine/core";
import { IconCopyright, IconHome } from "@tabler/icons-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

export default function TabControl() {
  const t = useSPETranslation();
  const { me } = authStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  if (me && !me?.isCopyMaster && pathname.includes("master")) {
    return <Navigate to="/copy/mine/positions" />;
  }
  return (
    <>
      {me?.isCopyMaster && (
        <Container fluid>
          <SegmentedControl
            value={pathname.includes("master") ? "1" : "3"}
            onChange={(v) => {
              navigate(
                v === "1"
                  ? "/copy/master/positions"
                  : "/copy/mine/positions",
              );
            }}
            color="primary"
            data={[
              {
                label: (
                  <Center style={{ gap: 10 }}>
                    <IconHome
                      style={{ width: rem(16), height: rem(16) }}
                    />
                    <span>{t("Master Dashboard")}</span>
                  </Center>
                ),
                value: "1",
              },
              {
                label: (
                  <Center style={{ gap: 10 }}>
                    <IconCopyright
                      style={{ width: rem(16), height: rem(16) }}
                    />
                    <span>{t("My Copy Trading")}</span>
                  </Center>
                ),
                value: "3",
              },
            ]}
          />
        </Container>
      )}
    </>
  );
}
