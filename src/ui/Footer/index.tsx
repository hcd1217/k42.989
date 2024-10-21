import useSPETranslation from "@/hooks/useSPETranslation";
import { Application } from "@/types";
import {
  Avatar,
  Box,
  Container,
  Flex,
  Grid,
  Group,
  Text,
  Title,
} from "@mantine/core";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { AppLogoVertical } from "../Logo/Logo";

export function Footer(props: Partial<{ metadata?: Application }>) {
  const t = useSPETranslation();
  const footer = useMemo(() => {
    return props.metadata?.applications?.layout.footer?.common;
  }, [props.metadata]);

  if (!footer) {
    return <></>;
  }

  return (
    <footer>
      <Box py={40} className="footer">
        <Container>
          <Grid>
            <Grid.Col
              span={{
                md: 3,
              }}
            >
              <Group gap={10}>
                <Box maw={"200px"}>
                  <AppLogoVertical />
                </Box>
              </Group>
              <Flex gap={10} mt={30}>
                {footer.socials?.map((s, i) => (
                  <Link
                    to={s.url ?? "/#"}
                    key={i}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Avatar
                      color="primary"
                      radius="sm"
                      src={s.icon}
                    />
                  </Link>
                ))}
              </Flex>
            </Grid.Col>
            <Grid.Col
              span={{
                md: 9,
              }}
            >
              <Grid justify={"end"}>
                {footer.groups?.map((group, i) => (
                  <Grid.Col
                    span={{
                      xs: 6,
                      sm: 4,
                      md: 3,
                    }}
                    key={i}
                  >
                    <Title order={4} mb={14} c="primary">
                      {t(group.name)}
                    </Title>
                    <Group>
                      {group.links.map((link, i) => (
                        <Link
                          className="foolink"
                          key={i}
                          to={link.url || "/#"}
                        >
                          <Text size="sm">{t(link.label)}</Text>
                        </Link>
                      ))}
                    </Group>
                  </Grid.Col>
                ))}
              </Grid>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
      <Box>
        <Container>
          <Group justify="center" py={10}>
            <Text fz={"12px"}>{footer.copyRight}</Text>
            <Text
              className="hoverlink"
              fz={"12px"}
              component={Link}
              to={footer.termOfService.url}
            >
              {t(footer.termOfService.label)}
            </Text>
            <Text
              className={"hoverlink"}
              fz={"12px"}
              component={Link}
              to={footer.privacyTerms.url}
              target="_blank"
            >
              {t(footer.privacyTerms.label)}
            </Text>
          </Group>
        </Container>
      </Box>
    </footer>
  );
}
