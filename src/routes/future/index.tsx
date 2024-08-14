import { GridTrade } from "@/ui/GridLayout/GridTrade";
import { Box } from "@mantine/core";
import { useParams } from "react-router-dom";

export default function FuturePage() {
  const { base, quote } = useParams();
  return (
    <Box className="bg-dark">
      <GridTrade
        isFuture
        symbol={`${base || ""}${quote || ""}`}
        base={base || ""}
        quote={quote || ""}
      />
    </Box>
  );
}
