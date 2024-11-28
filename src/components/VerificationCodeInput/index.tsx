import { IS_DEV } from "@/domain/config";
import useSPETranslation from "@/hooks/useSPETranslation";
import logger from "@/services/logger";
import {
  Button,
  Flex,
  TextInput,
  TextInputProps,
} from "@mantine/core";
import { useInterval } from "@mantine/hooks";
import { useState } from "react";

export function VerificationCodeInput({
  disabled,
  rightSection,
  onclick,
  ...props
}: TextInputProps & {
  onclick: () => void;
}) {
  logger.trace("skip", rightSection);
  const t = useSPETranslation();
  const [seconds, setSeconds] = useState(0);

  const interval = useInterval(
    () =>
      setSeconds((s) => {
        if (s == 0) {
          interval.stop();
          return 0;
        }
        return s - 1;
      }),
    1000,
  );

  return (
    <TextInput
      {...props}
      rightSection={
        <Flex px={10} w={"100%"}>
          <Button
            disabled={interval.active || disabled}
            p={0}
            variant="transparent"
            onClick={() => {
              setSeconds(IS_DEV ? 5 : 60);
              onclick();
              interval.start();
            }}
          >
            {!interval.active && t("Send")}
            {interval.active && `${seconds}s`}
          </Button>
        </Flex>
      }
    />
  );
}
