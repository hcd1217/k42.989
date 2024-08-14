import authStore from "@/store/auth";
import SPEMasterOpenPosition from "@/ui/SPEMasterOpenPosition";
import { Box } from "@mantine/core";

export default function MasterPositions() {
  const { me } = authStore();
  return (
    <Box h={"100%"} w={"100%"}>
      <SPEMasterOpenPosition
        masterAccountId={me?.masterAccountId || ""}
      />
    </Box>
  );
}
