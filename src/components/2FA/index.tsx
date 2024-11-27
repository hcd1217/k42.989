import useSPETranslation from "@/hooks/useSPETranslation";
import { PasteButton } from "@/ui/PasteButton";
import {
  Button,
  Grid,
  GridCol,
  PinInput,
  Stack,
} from "@mantine/core";
import { useCallback, useState } from "react";

export default function MfaForm({
  onSubmit,
}: {
  onSubmit: (code: string) => void;
}) {
  const t = useSPETranslation();
  const [value, setValue] = useState<string>("");
  const handleSubmit = useCallback(() => {
    onSubmit(value as string);
  }, [value, onSubmit]);

  return (
    <Stack>
      <PinInput
        my={"md"}
        styles={{
          root: {
            width: "100%",
            justifyContent: "space-around",
          },
        }}
        onChange={(v) => setValue(v)}
        value={value as string}
        length={6}
        type={/^[0-9]*$/}
        inputType="tel"
        inputMode="numeric"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            value.length === 6 && handleSubmit();
            e.stopPropagation();
          }
        }}
      />

      <Grid columns={32}>
        <GridCol span={10}>
          <PasteButton onPaste={(v) => setValue(v)} />
        </GridCol>
        <GridCol span={22}>
          <Button
            fullWidth
            disabled={value?.length < 6}
            onClick={handleSubmit}
          >
            {t("Submit")}
          </Button>
        </GridCol>
      </Grid>
    </Stack>
  );
}
