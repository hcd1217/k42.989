import { GridTrade } from "@/ui/GridLayout/GridTrade";
import { Box } from "@mantine/core";
import { useParams } from "react-router-dom";

export default function SpotPage() {
  const { base, quote } = useParams();
  return (
    <Box className="bg-dark">
      <GridTrade
        isSpot
        symbol={`${base || ""}_${quote || ""}_SPOT`}
        base={base || ""}
        quote={quote || ""}
      />
    </Box>
  );
}
