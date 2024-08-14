import { ROWS_PER_PAGE } from "@/common/configs";
import logger from "@/services/logger";
import { GenericObject } from "@/types";
import { useCallback, useEffect, useState } from "react";

export default function useSPEPagination<T extends GenericObject>(
  fetch: (
    cursor: string,
    limit: number,
    reverse: boolean,
  ) => Promise<T[]>,
  cursorKey = "id",
  limit = ROWS_PER_PAGE,
) {
  const [init, setInit] = useState(true);
  const [data, setData] = useState<T[]>([]);
  const [rawData, setRawData] = useState<T[]>([]);
  const [haveNextPage, setHaveNextPage] = useState(false);
  const [havePreviousPage, setHavePreviousPage] = useState(false);
  const [{ cursor, reverse }, setCursor] = useState({
    cursor: "",
    reverse: false,
  });

  useEffect(() => {
    setTimeout(
      () => {
        const _limit = limit + (reverse ? 2 : 1);
        fetch(cursor, _limit, reverse).then((data: T[]) => {
          logger.trace(
            "useSPEPagination",
            data.map((el) => el[cursorKey] as string),
          );
          setRawData(data);
          const from = reverse ? 1 : 0;
          setData(data.slice(from, from + limit));
          reverse
            ? setHavePreviousPage(data.length === _limit)
            : setHaveNextPage(data.length === _limit);
          setInit(false);
        });
      },
      init ? 200 : 1,
    );
  }, [cursor, cursorKey, fetch, init, limit, reverse]);

  const goNext = useCallback(() => {
    logger.trace("goNext");
    setHavePreviousPage(true);
    setCursor({
      reverse: false,
      cursor: (rawData[rawData.length - 1] as Record<string, string>)[
        cursorKey
      ],
    });
  }, [cursorKey, rawData]);

  const goPrev = useCallback(() => {
    logger.trace("goPrev");
    setHaveNextPage(true);
    setCursor({
      reverse: true,
      cursor: (rawData[0] as Record<string, string>)[cursorKey],
    });
  }, [cursorKey, rawData]);

  return {
    data,
    reverse,
    haveNextPage,
    goNext,
    goPrev,
    setCursor,
    setHaveNextPage,
    setHavePreviousPage,
    havePreviousPage,
  };
}
