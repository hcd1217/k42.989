import { fetch } from "@/services/apis";
import { ImageType } from "@/types";
import { ReactNode } from "react";
import useSWR, { SWRResponse } from "swr";

type PropsType = {
  children: (res: SWRResponse<{ url: string }>) => ReactNode;
};
export default function ImageS3(props: PropsType) {
  const res = useSWR<{ url: string }>(
    `api/me/upload/url?type=${ImageType.AVATAR}`,
    fetch,
  );
  return <>{props.children && props.children(res)}</>;
}
