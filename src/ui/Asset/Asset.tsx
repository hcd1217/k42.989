import { ASSET_COIN_LIST } from "@/common/configs";
import { COIN_IMAGES } from "@/domain/config";
import { Box, Flex, Image, Text, Title } from "@mantine/core";

export function Asset({ asset }: { asset: string }) {
  return (
    <>
      <Flex align={"center"} gap={10}>
        <Box>
          <Image w={30} h={30} src={COIN_IMAGES[asset]} />
        </Box>
        <Box>
          <Title order={6}>{asset}</Title>
          <Text c="dimmed">{ASSET_COIN_LIST[asset]}</Text>
        </Box>
      </Flex>
    </>
  );
}
