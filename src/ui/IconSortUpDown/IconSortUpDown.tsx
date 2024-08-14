import { Box, Flex } from "@mantine/core";
import {
  IconCaretDownFilled,
  IconCaretUpFilled,
} from "@tabler/icons-react";
import { useCallback, useState } from "react";

export function IconSortUpDown({
  pos = 0,
  text,
}: Partial<{ pos: 1 | 2 | 0; text: string | React.ReactNode }>) {
  // "up" | "down" | "default"
  const [_status, setStatus] = useState<1 | 2 | 0>(pos);
  const onChangeStatus = useCallback(() => {
    switch (_status) {
      case 2:
        setStatus(0);
        break;
      case 1:
        setStatus(2);
        break;
      default:
        setStatus(1);
        break;
    }
  }, [_status]);

  return (
    <>
      <Flex
        align={"center"}
        gap={5}
        style={{ cursor: "pointer" }}
        onClick={onChangeStatus}
      >
        {text && text}
        <Box
          pos={"relative"}
          h={20}
          w={20}
          style={{ cursor: "pointer" }}
        >
          <Box
            style={{
              top: "calc(50% - 1px)",
              transform: "translateY(-50%)",
            }}
            pos={"absolute"}
          >
            <IconCaretUpFilled
              size={12}
              color={_status === 1 ? "#f29525" : "#81858c"}
            />
          </Box>
          <Box
            style={{
              top: "calc(50% + 4px)",
              transform: "translateY(-50%)",
            }}
            pos={"absolute"}
          >
            <IconCaretDownFilled
              size={12}
              color={_status === 2 ? "#f29525" : "#81858c"}
            />
          </Box>
        </Box>
      </Flex>
    </>
  );
}
