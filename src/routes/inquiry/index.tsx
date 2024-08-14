import useSPETranslation from "@/hooks/useSPETranslation";
import { inquiryApi } from "@/services/apis";
import { error, success } from "@/utils/notifications";
import {
  Box,
  Button,
  Card,
  Center,
  Select,
  SimpleGrid,
  Space,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useBoolean } from "usehooks-ts";

export default function Inquiry() {
  const t = useSPETranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { value: sent, setTrue } = useBoolean(false);
  const [form, setForm] = useState({
    subject: "",
    fullName: "",
    email: "",
    phone: "",
    type: searchParams.get("type") || "Trading",
    priority: "1",
    content: "",
  });
  return (
    <Box mih={"calc(100vh - 200px)"} pb={50} pt={20}>
      <Center>
        <Card
          maw={"75vw"}
          w={"100%"}
          p={"24px"}
          shadow="0 0 24px 0 rgba(18,18,20,.1)"
          padding="sm"
          radius="25px"
          mx={"auto"}
        >
          <SimpleGrid
            cols={1}
            styles={{
              container: {
                gap: "10px",
              },
            }}
          >
            <Title>{t("Inquiry")}</Title>
            <TextInput
              size="sm"
              label={t("Subject")}
              value={form.subject}
              onChange={(e) =>
                setForm({ ...form, subject: e.currentTarget.value })
              }
            />
            <TextInput
              size="sm"
              label={t("Full Name")}
              value={form.fullName}
              onChange={(e) =>
                setForm({ ...form, fullName: e.currentTarget.value })
              }
            />
            <SimpleGrid cols={2}>
              <TextInput
                size="sm"
                label={t("Email Address")}
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.currentTarget.value })
                }
              />
              <TextInput
                size="sm"
                label={t("Phone Number")}
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.currentTarget.value })
                }
              />
            </SimpleGrid>
            <SimpleGrid cols={2}>
              <Select
                size="sm"
                data={[
                  {
                    label: t("Trading"),
                    value: "Trading",
                  },
                  {
                    label: t("Copy Trade"),
                    value: "Copy Trade",
                  },
                  {
                    label: t("Funding"),
                    value: "Funding",
                  },
                  {
                    label: t("Affiliate"),
                    value: "Affiliate",
                  },
                  {
                    label: t("Copy Master"),
                    value: "CopyMaster",
                  },
                  {
                    label: t("Others"),
                    value: "Others",
                  },
                ]}
                label={t("Inquiry type")}
                value={form.type}
                onChange={(value) =>
                  value && setForm({ ...form, type: value })
                }
              />
              <Select
                size="sm"
                data={[
                  {
                    label: t("High"),
                    value: "1",
                  },
                  {
                    label: t("Medium"),
                    value: "3",
                  },
                  {
                    label: t("Low"),
                    value: "2",
                  },
                ]}
                label={t("Priority Level")}
                value={form.priority}
                onChange={(value) =>
                  value && setForm({ ...form, priority: value })
                }
              />
            </SimpleGrid>
            <Textarea
              value={form.content}
              onChange={(el) =>
                setForm({ ...form, content: el.target.value })
              }
              label={t("Content")}
              size="sm"
              rows={10}
            />
            <Space />
            <Box>
              <Button
                disabled={sent}
                size="sm"
                color="gray"
                variant="gradient"
                gradient={{ from: "primary", to: "yellow", deg: 90 }}
                fullWidth
                onClick={() => {
                  setTrue();
                  inquiryApi(form)
                    .then(() => {
                      success(
                        t("Success"),
                        t("Inquiry sent, we will contact you soon"),
                      );
                      setTimeout(() => {
                        navigate("/");
                      }, 2000);
                    })
                    .catch((err) => {
                      error(
                        t("Something went wrong"),
                        t(err?.message || "Cannot send your inquiry"),
                      );
                    });
                }}
              >
                {t("Send")}
              </Button>
            </Box>
          </SimpleGrid>
        </Card>
      </Center>
    </Box>
  );
}
