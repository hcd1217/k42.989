import "@mantine/dropzone/styles.css";

import { S3_HOST } from "@/common/configs";
import useSPETranslation from "@/hooks/useSPETranslation";
import { getUploadUrlApi, updateUserApi } from "@/services/apis";
import authStore from "@/store/auth";
import { ImageType, UserUpdateType } from "@/types";
import { error, success } from "@/utils/notifications";
import {
  Avatar,
  AvatarProps,
  Box,
  Flex,
  Group,
  Modal,
  SimpleGrid,
  Space,
  rem,
} from "@mantine/core";
import {
  Dropzone,
  DropzoneProps,
  FileWithPath,
  IMAGE_MIME_TYPE,
} from "@mantine/dropzone";
import { useDisclosure, useHover } from "@mantine/hooks";
import {
  IconPencil,
  IconPhoto,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppButton from "../Button/AppButton";

export function SPEAvatar(props: AvatarProps) {
  const { me } = authStore();
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const { hovered, ref } = useHover();

  const [file, setFile] = useState<FileWithPath>();
  const [preview, setPreview] = useState<string>();
  const [loading, setLoading] = useState(false);

  const t = useSPETranslation();
  const uploadAvatar = useCallback(async () => {
    if (!file) {
      return;
    }
    setLoading(true);
    const endPoint = await getUploadUrlApi(
      ImageType.AVATAR,
      file.name,
    );
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await axios.put(endPoint, reader.result, {
          headers: { "Content-Type": file.type },
        });
        await updateUserApi(UserUpdateType.AVATAR, {
          avatar: `${S3_HOST}/upload/images/${me?.id}/${file.name}`,
        }).then(() => {
          close();
          navigate(0);
          success(t("Success"), t("Avatar has been changed"));
        });
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
  }, [close, file, me?.id, navigate, t]);

  return (
    <>
      <Box
        ref={ref}
        pos={"relative"}
        w={props.size}
        onClick={() => {
          setFile(undefined);
          open();
        }}
        style={
          {
            // cursor: props.isEdit ? "pointer" : "default",
          }
        }
      >
        <Box
          opacity={hovered ? 1 : 0}
          pos={"absolute"}
          bottom={0}
          right={0}
          style={{
            cursor: "pointer",
          }}
        >
          <IconPencil size={18} opacity={0.6} />
        </Box>
        <Avatar {...props} src={props.src} />
      </Box>
      <Modal
        closeOnClickOutside={false}
        opened={opened}
        onClose={close}
        title={t("Upload Picture")}
        centered
      >
        {!preview ? (
          <AvatarUploader
            multiple={false}
            h={"300px"}
            title={t("Upload Avatar")}
            onDrop={(files: FileWithPath[]) => {
              setFile(files[0]);
              const reader = new FileReader();
              reader.onloadend = () =>
                setPreview(reader.result as string);
              reader.readAsDataURL(files[0]);
            }}
          />
        ) : (
          <Flex
            justify={"center"}
            align={"center"}
            pos={"relative"}
            w={"100%"}
            h={"300px"}
          >
            <Avatar size={300} src={preview} />
          </Flex>
        )}
        <Space my={"md"} />
        <SimpleGrid cols={2}>
          <AppButton
            disabled={!file || loading}
            fullWidth
            onClick={() => {
              setFile(undefined);
              setPreview(undefined);
            }}
            c={"gray"}
            variant="outline"
          >
            {t("Cancel")}
          </AppButton>
          <AppButton
            disabled={!file || loading}
            loading={loading}
            fullWidth
            onClick={uploadAvatar}
          >
            {t("Confirm")}
          </AppButton>
        </SimpleGrid>
      </Modal>
    </>
  );
}

function AvatarUploader(props: DropzoneProps) {
  return (
    <>
      <Dropzone
        {...props}
        maxSize={5 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
        styles={{
          inner: {
            height: "100%",
          },
        }}
      >
        <Group
          h={"100%"}
          justify="center"
          align="center"
          gap="xl"
          style={{ pointerEvents: "none" }}
        >
          <Dropzone.Accept>
            <IconUpload
              style={{
                width: rem(52),
                height: rem(52),
                color: "var(--mantine-color-blue-6)",
              }}
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              style={{
                width: rem(52),
                height: rem(52),
                color: "var(--mantine-color-red-6)",
              }}
              stroke={1.5}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto
              style={{
                width: rem(52),
                height: rem(52),
                color: "var(--mantine-color-dimmed)",
              }}
              stroke={1.5}
            />
          </Dropzone.Idle>
        </Group>
      </Dropzone>
    </>
  );
}
