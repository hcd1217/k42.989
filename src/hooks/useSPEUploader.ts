import { S3_HOST } from "@/common/configs";
import { getUploadUrlApi } from "@/services/apis";
import authStore from "@/store/auth";
import { ImageType } from "@/types";
import { error } from "@/utils/notifications";
import { FileWithPath } from "@mantine/dropzone";
import axios from "axios";
import { useCallback, useState } from "react";
import useSPETranslation from "./useSPETranslation";

type propsType = {
  onSuccess?: (file: string, type: `${ImageType}`) => void;
  onProgress?: (type: `${ImageType}`) => void;
  onError?: (type: `${ImageType}`) => void;
};
export default function useSPEUploader(props: propsType) {
  const { me } = authStore();
  const [, setFile] = useState<FileWithPath>();
  const [loading, setLoading] = useState(false);

  const t = useSPETranslation();
  const uploadFile = useCallback(
    async (
      file: FileWithPath,
      type: `${ImageType}`,
      fileName?: string,
    ) => {
      if (!file) {
        return;
      }
      const ext = file.name.split(".").pop();
      setLoading(true);
      const uploadFileName = fileName
        ? `${fileName}.${ext}`
        : file.name;
      const endPoint = await getUploadUrlApi(type, uploadFileName);
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          await axios.put(endPoint, reader.result, {
            headers: { "Content-Type": file.type },
          });
          if (props.onSuccess) {
            const _file = `${S3_HOST}/upload/images/${me?.id}/${uploadFileName}`;
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
