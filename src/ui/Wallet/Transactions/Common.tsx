import { Anchor, Title, Text, Flex, Tooltip } from "@mantine/core";
import { shortAddress } from "@/common/transaction";

export const Address = ({
  t,
  explorerUrl,
  address,
}: {
  t: (k: string) => string;
  address: string;
  explorerUrl?: { value: string; label: string };
}) => {
  return (
    <>
      <Text hiddenFrom="sm" c={"dimmed"}>
        {t("From Address")}
      </Text>
      <Title order={6} fz={12}>
        {explorerUrl?.value ? (
          <Anchor
            target="_blank"
            href={explorerUrl?.value}
            underline="never"
          >
            <Flex direction={"column"}>
              <Text fz={12} fw="bold">
                <Tooltip label={address}>
                  <span>{shortAddress(address)}</span>
                </Tooltip>
              </Text>
              <Text fz={12} c={"dimmed"} fw="bold">
                {explorerUrl?.label || "--"}
              </Text>
            </Flex>
          </Anchor>
        ) : (
          <Flex direction={"column"}>
            <Text fz={12} fw="bold" c={"dimmed"}>
              <Tooltip label={address}>
                <span>{shortAddress(address)}</span>
              </Tooltip>
            </Text>
            <Text fz={12} fw="bold" c={"dimmed"}>
              {explorerUrl?.label || "--"}
            </Text>
          </Flex>
        )}
      </Title>
    </>
  );
};
