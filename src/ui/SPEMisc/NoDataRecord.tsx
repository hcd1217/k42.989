import noDataImg from "@/assets/images/undraw_no_data_re_kwbl.svg"; // cspell:disable-line
import { Flex, Image, Title } from "@mantine/core";

export function NoDataRecord() {
  return (
    <Flex align={"center"} justify={"center"} w={"100%"} py={40}>
      <Flex
        direction={"column"}
        align={"center"}
        justify={"center"}
        gap={10}
      >
        <Image w={100} src={noDataImg} />
        <Title
          styles={{
            root: {
              textAlign: "center",
            },
          }}
          order={5}
          c={"dimmed"}
        >
          No Data
        </Title>
      </Flex>
    </Flex>
  );
}
