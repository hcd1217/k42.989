import { rem } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { ReactNode } from "react";

export const success = (
  title: string | ReactNode,
  message: string | ReactNode,
) => {
  notifications.show({
    color: "teal",
    title: title,
    message,
    icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
    loading: false,
    autoClose: 5000,
    position: "top-center",
  });
};

export const error = (
  title: string | ReactNode,
  message: string | ReactNode,
) => {
  notifications.show({
    color: "red",
    title,
    message,
    icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
    loading: false,
    autoClose: 5000,
    position: "top-center",
  });
};
