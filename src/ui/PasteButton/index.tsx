import useSPETranslation from "@/hooks/useSPETranslation";
import { Button } from "@mantine/core";
import { IconClipboard } from "@tabler/icons-react";

type Props = {
  onPaste: (value: string) => void;
};
export function PasteButton(props: Props) {
  const t = useSPETranslation();
  const doPaste = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .readText()
        .then((text) => {
          props.onPaste(text);
        })
        .catch(() => {
          //
        });
    } else {
      //
    }
  };
  return (
    <Button
      onClick={doPaste}
      fullWidth
      variant="outline"
      leftSection={<IconClipboard size={14} />}
    >
      {t("Paste")}
    </Button>
  );
}
