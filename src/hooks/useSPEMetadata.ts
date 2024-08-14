import { Application } from "@/common/types";
import { fetch } from "@/services/apis";
import logger from "@/services/logger";
import { useEffect, useState } from "react";

export default function useSPEMetadata() {
  const [data, setData] = useState<Application>();

  useEffect(() => {
    if (localStorage.__INFORMATION__) {
      try {
        const data = JSON.parse(localStorage.__INFORMATION__);
        setData(data);
      } catch (e) {
        logger.error(e);
        delete localStorage.__INFORMATION__;
      }
    }
  }, []);

  useEffect(() => {
    fetch<Application>("/api/information").then((data) => {
      localStorage.__INFORMATION__ = JSON.stringify(data);
      setData(data);
    });
  }, []);
  return { data };
}
