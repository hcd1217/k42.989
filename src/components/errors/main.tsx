import useSPETranslation from "@/hooks/useSPETranslation";
import { Button } from "@mantine/core";

export const MainErrorFallback = () => {
  const t = useSPETranslation();

  return (
    <div>
      <h2 className="text-lg font-semibold">
        {t("Oops, something went wrong")}
      </h2>
      <Button
        className="mt-4"
        onClick={() => window.location.assign(window.location.origin)}
      >
        Refresh
      </Button>
    </div>
  );
};
