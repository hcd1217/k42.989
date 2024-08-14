import useSPETranslation from "@/hooks/useSPETranslation";
import { Button, Flex } from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

export function SPEPagination({
  havePreviousPage,
  haveNextPage,
  goPrev,
  goNext,
}: {
  havePreviousPage?: boolean;
  haveNextPage?: boolean;
  goPrev: () => void;
  goNext: () => void;
}) {
  const t = useSPETranslation();

  return haveNextPage || havePreviousPage ? (
    <Flex justify={"center"} mt={20} gap={10}>
      {" "}
      <Button size="xs" disabled={!havePreviousPage} onClick={goPrev}>
        <IconArrowLeft size={16} /> {t("Previous page")}
      </Button>
      <Button size="xs" disabled={!haveNextPage} onClick={goNext}>
        {t("Next page")} <IconArrowRight size={16} />
      </Button>
    </Flex>
  ) : (
    <> </>
  );
}
