import useSPETranslation from "@/hooks/useSPETranslation";
import { pauseFollowerApi } from "@/services/apis";
import { error, success } from "@/utils/notifications";
import { Box, Button, Flex, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
/*
After removal, the current position will be immediately closed, and any associated profits will be distributed instantly.
Follower UID:1680449103908050944
*/
export function RemoveFollowerForm({
  uid,
  accountId,
}: {
  uid: string;
  accountId: string;
}) {
  const t = useSPETranslation();
  return (
    <Box className="space-y-10">
      <Box fz={14} color="dimmed">
        {t(
          "After removal, the current position will be immediately closed, and any associated profits will be distributed instantly.",
        )}
      </Box>
      <Flex justify="start" gap={5} align="center">
        <Text fz={14} c="dimmed">
          {t("Follower UID")}:
        </Text>
        <Text fz={14} fw="bold">
          {uid}
        </Text>
      </Flex>
      <Box w={"100%"}>
        <Button
          fullWidth
          onClick={() => {
            pauseFollowerApi(accountId)
              .then(() => {
                success(t("Success"), t("Follower has been removed"));
              })
              .catch(() => {
                error(
                  t("Something went wrong"),
                  t("Cannot remove the follower"),
                );
              })
              .finally(() => {
                modals.closeAll();
                setTimeout(() => {
                  window.location.reload();
                }, 100);
              });
          }}
        >
          {t("Confirm")}
        </Button>
      </Box>
    </Box>
  );
}
