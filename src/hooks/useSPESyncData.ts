import logger from "@/services/logger";
import { isBlur } from "@/utils/utility";
import { useInterval } from "@mantine/hooks";
import { useCallback, useEffect, useState } from "react";

export default function useSPESyncData<T>(
  fetchData: () => Promise<T | undefined>,
  intervalTime = 30e3,
  _defaultData?: T,
) {
  const [{ data }, setData] = useState<{ data?: T }>({
    data: _defaultData,
  });

  const _fetch = useCallback(() => {
    if (isBlur()) {
      logger.trace("Skip fetching data");
      return;
    }
    logger.trace("Fetching data...");
    return fetchData().then((data) => {
      data && setData({ data });
    });
  }, [fetchData]);

  const interval = useInterval(() => {
    _fetch();
  }, Math.max(intervalTime, 2e3));

  useEffect(() => {
    interval.start();
    return interval.stop;
  }, [interval]);

  useEffect(() => {
    _fetch();
  }, [_fetch]);

  return data;
}
