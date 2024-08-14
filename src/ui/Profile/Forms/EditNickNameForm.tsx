import defaultAvatar from "@/assets/images/defaultAvatar.png";
import useSPETranslation from "@/hooks/useSPETranslation";
import { updateUserApi } from "@/services/apis";
import authStore from "@/store/auth";
import { UserUpdateType } from "@/types";
import { SPEAvatar } from "@/ui/AvatarUploader";
import { error, success } from "@/utils/notifications";
import { reloadWindow } from "@/utils/utility";
import {
  Badge,
  Box,
  Button,
  Flex,
  rem,
  SimpleGrid,
  Text,
  TextInput,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCircleCheck, IconEdit } from "@tabler/icons-react";
import { useState } from "react";

export function EditNickNameForm() {
  const t = useSPETranslation();
  const { avatar, me, displayName } = authStore();

  const onChangeNickName = () => {
    modals.open({
      title: t("Add a nickname"),
      children: <ModalNickName nickName={me?.nickName || ""} />,
      centered: true,
    });
  };
  return (
    <>
      <Flex gap={12} align={"center"}>
        <Box>
          <SPEAvatar size={72} src={avatar || defaultAvatar} />
        </Box>
        <Box>
          <Flex align={"center"} gap={10}>
            <Text fz={24} fw={600}>
              {displayName}
            </Text>
            <Button
              onClick={onChangeNickName}
              p={0}
              m={0}
              variant="transparent"
            >
              <IconEdit size={16} color="gray" />
            </Button>
          </Flex>
          <Badge
            tt={"capitalize"}
            fw={"normal"}
            variant="light"
            color={"#33006c"}
            leftSection={
              <IconCircleCheck
                style={{ width: rem(12), height: rem(12) }}
              />
            }
          >
            {t("Identity Verification Lv.")} {me?.kycLevel || 0}
          </Badge>
        </Box>
      </Flex>
    </>
  );
}

export function ModalNickName({ nickName }: { nickName: string }) {
  const t = useSPETranslation();
  const [newNickName, setNewNickName] = useState(nickName);
  return (
    <>
      <TextInput
        label={t("Nickname")}
        value={newNickName}
        onChange={(e) => setNewNickName(e.currentTarget.value)}
      />
      <SimpleGrid cols={2} mt={"xl"}>
        <Button
          fullWidth
          onClick={() => {
            updateUserApi(UserUpdateType.NICK_NAME, {
              nickName: newNickName,
            })
              .then(() => {
                success(t("Success"), t("Nickname updated"));
                reloadWindow();
              })
              .catch(() => {
                error(
                  t("Something went wrong"),
                  t("Cannot update your nickname"),
                );
              })
              .finally(() => {
                modals.closeAll();
              });
          }}
        >
          {t("Confirm")}
        </Button>
        <Button
          color="gray"
          variant="outline"
          fullWidth
          onClick={() => {
            modals.closeAll();
          }}
        >
          {t("Cancel")}
        </Button>
      </SimpleGrid>
    </>
  );
}
