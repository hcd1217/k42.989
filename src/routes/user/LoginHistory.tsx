import useSPETranslation from "@/hooks/useSPETranslation";
import { loginHistoryApi } from "@/services/apis";
import { LoginHistory } from "@/types";
import { fmtDate } from "@/utils/utility";
import { Box, Table, TableData, Text } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";

const IS_DEBUG = true;
export function LoginHistories() {
  const [loginHistories, setHistory] = useState<LoginHistory[]>([]);
  const t = useSPETranslation();
  const tableData = useMemo<TableData>(() => {
    return {
      head: [
        t("Login Time"),
        t("IP Address"),
        t("Device"),
        t("Login Status"),
      ],
      body: [
        ...loginHistories.map((r) => [
          <>
            <Text
              size="sm"
              styles={{ root: { whiteSpace: "nowrap" } }}
            >
              {fmtDate(r.timestamp)}
            </Text>
          </>,
          <>
            <Text size="sm">{r.ip}</Text>
          </>,
          <>
            <Box maw={250}>
              <Text size="sm">{r.userAgent}</Text>
            </Box>
          </>,
          <>
            <Text c={r.status === "failed" ? "red" : ""}>
              {r.status}
            </Text>
          </>,
        ]),
      ],
    };
  }, [loginHistories, t]);

  useEffect(() => {
    const histories: LoginHistory[] = [
      ...Array.from({ length: 30 }).map(() => ({
        status: ["success", "failed"][Math.floor(Math.random() * 2)],
        ip: `86.48.10.${Math.floor(Math.random() * 255)}`,
        timestamp: Date.now(),
        // cspell:ignore KHTML
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      })),
    ];
    loginHistoryApi()
      .then((res) => {
        if (res.data?.result) {
          setHistory(histories);
        }
      })
      .catch(() => {
        if (IS_DEBUG) {
          setHistory(histories);
        }
      });
  }, []);

  return (
    <>
      <Table.ScrollContainer minWidth={"100%"} h={"100%"}>
        <Table
          data={tableData}
          stickyHeader
          highlightOnHover
          styles={{
            th: {
              whiteSpace: "nowrap",
              fontSize: "12px",
            },
          }}
          classNames={{
            table: "table-sticky-column table-list-gird-view",
          }}
        />
      </Table.ScrollContainer>
    </>
  );
}
