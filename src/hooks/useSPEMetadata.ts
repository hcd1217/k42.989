import { Application } from "@/common/types";
import { fetch } from "@/services/apis";
import logger from "@/services/logger";
import { useEffect, useState } from "react";

export default function useSPEMetadata() {
  const [data, setData] = useState<Application>();

  useEffect(() => {
    let version = "0";
    if (localStorage.__INFORMATION__) {
      try {
        const data = JSON.parse(localStorage.__INFORMATION__);
        setData(data);
        if (data?.version) {
          version = data?.version;
        }
      } catch (e) {
        logger.error(e);
        delete localStorage.__INFORMATION__;
      }
    }
    fetch<Application>(`/api/information?v=${version}`).then((data) => {
      if (data.version !== version) {
        localStorage.__INFORMATION__ = JSON.stringify(data);
        setData(data);
      }
    });
  }, []);

  return { data };
}
