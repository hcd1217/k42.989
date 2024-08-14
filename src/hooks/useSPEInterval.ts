import logger from "@/services/logger";
import { isBlur } from "@/utils/utility";
import { useInterval } from "@mantine/hooks";
import { useCallback, useEffect } from "react";

export default function useSPEInterval(
  fetch: () => void,
  intervalTime: number,
  skipFirstFetch = false,
  key?: string
) {
  const _fetch = useCallback(() => {
    if (isBlur()) {
      logger.trace("Skip fetching data", key, intervalTime);
      return;
    }
    logger.trace("Fetching data...", key, intervalTime);
    fetch();
  }, [fetch, key, intervalTime]);
  useEffect(() => {
    !skipFirstFetch && _fetch();
  }, [_fetch, skipFirstFetch, key]);

  const interval = useInterval(_fetch, intervalTime);

  useEffect(() => {
    interval.start();
    return interval.stop;
  }, [interval, fetch]);
}
