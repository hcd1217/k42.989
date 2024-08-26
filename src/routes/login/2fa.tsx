import useSPETranslation from "@/hooks/useSPETranslation";
import { Button, PinInput, Stack } from "@mantine/core";
import { useCallback, useState } from "react";

export default function MfaModal({
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
    <>
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
        />
        <Button
          disabled={value?.length < 6}
          onClick={handleSubmit}
        >
          {t("Submit")}
        </Button>
      </Stack>
    </>
  );
}
