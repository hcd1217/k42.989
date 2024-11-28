import authStore from "@/store/auth";
import SPEMasterOrderHistory from "@/ui/SPEMasterOrderHistory";
import { Box } from "@mantine/core";

export default function MasterOrders() {
  const { me } = authStore();
  return (
    <Box h={"100%"} w={"100%"}>
      <SPEMasterOrderHistory
        masterAccountId={me?.masterAccountId || ""}
      />
    </Box>
  );
}
