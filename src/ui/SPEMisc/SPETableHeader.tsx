import { buildArray } from "@/common/utils";
import useSPETranslation from "@/hooks/useSPETranslation";
import { Box } from "@mantine/core";

export function SPETableHeader({
  label,
}: {
  label: string | string[];
}) {
  const t = useSPETranslation();
  return (
    <Box
      py={5}
      style={{
        whiteSpace: "pre",
      }}
    >
      {buildArray(label).map((label, idx) => (
        <span key={idx}>
          {t(label)}
          <br />
        </span>
      ))}
    </Box>
  );
}
