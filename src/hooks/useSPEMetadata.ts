import { Application } from "@/common/types";
import { fetch } from "@/services/apis";
import logger from "@/services/logger";
import { useEffect, useState } from "react";

export default function useSPEMetadata() {
  const [data, setData] = useState<Application>();

  useEffect(() => {
    const data = _load();
    data && setData(data);
    const version = data?.version || "0";
    const url = `/api/information?v=${version}`;
    fetch<Application>(url).then((data) => {
      if (data.version !== version) {
        _cache(data);
        setData(data);
      }
    });
  }, []);

  return { data };
}

function _load() {
  try {
    if (localStorage.__INFORMATION__) {
      return JSON.parse(localStorage.__INFORMATION__) as Application;
    }
  } catch (e) {
    logger.error(e);
    delete localStorage.__INFORMATION__;
  }
}

function _cache(data: Application) {
  localStorage.__INFORMATION__ = JSON.stringify(data);
}
