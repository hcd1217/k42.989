import authStore from "@/store/auth";
import { FileWithPath } from "@mantine/dropzone";
import { useCallback, useState } from "react";
import useSPETranslation from "./useSPETranslation";
import { ImageType } from "@/types";
import { getUploadUrlApi } from "@/services/apis";
import axios from "axios";
import { S3_HOST } from "@/common/configs";
import { error } from "@/utils/notifications";

type propsType = {
  onSuccess?: (file: string, type: `${ImageType}`) => void;
  onProgress?: (type: `${ImageType}`) => void;
  onError?: (type: `${ImageType}`) => void;
};
export default function useUploader(props: propsType) {
  const { me } = authStore();
  const [, setFile] = useState<FileWithPath>();
  const [loading, setLoading] = useState(false);

  const t = useSPETranslation();
  const uploadFile = useCallback(
    async (file: FileWithPath, type: `${ImageType}`) => {
      if (!file) {
        return;
      }
      setLoading(true);
      const endPoint = await getUploadUrlApi(type, file.name);
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          await axios.put(endPoint, reader.result, {
            headers: { "Content-Type": file.type },
          });
          if (props.onSuccess) {
            const _file = `${S3_HOST}/upload/images/${me?.id}/${file.name}`;
            props?.onSuccess(_file, type);
          }
          setLoading(false);
        } catch (err) {
          error(
            t("Error Occurred While Uploading Image"),
            t(
              "An error occurred while trying to upload the image. Please check your file and try again.",
            ),
          );
          setLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    },
    [props, t, me?.id],
  );
  return {
    uploadFile,
    loading,
    setFile,
  };
}
