import { avatarUrl } from "@/utils/utility";
import { Avatar, Flex, Text } from "@mantine/core";

export function MasterTrader({
  avatar,
  name,
}: {
  avatar?: string;
  name?: string;
}) {
  return (
    <Flex justify="start" align="center" gap={30}>
      <Avatar size={50} src={avatarUrl(avatar)} />
      <Text fz={14} fw="bold">
        {name}
      </Text>
    </Flex>
  );
}
