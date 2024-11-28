import { Language } from "@/services/languages";
import {
  ActionIcon,
  Menu,
  lighten,
  useComputedColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconWorld } from "@tabler/icons-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./index.module.scss";

type PropsType = {
  onDarkMode?: boolean;
};

export default function SwitchLanguage(
  props: PropsType = {
    onDarkMode: true,
  },
) {
  const theme = useMantineTheme();
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const navigate = useNavigate();
  const onChange = (lan: Language) => {
    localStorage.__LANGUAGE__ = lan;
    navigate(0);
  };
  const activeLanguage = useMemo(() => {
    return localStorage.__LANGUAGE__;
  }, []);
  return (
    <Menu
      shadow="none"
      width={150}
      trigger="hover"
      radius={0}
      offset={0}
    >
      <Menu.Target>
        <ActionIcon variant="transparent" size="xl" h={"100%"}>
          {props.onDarkMode && (
            <IconWorld color={lighten(theme.colors.dark[7], 1)} />
          )}
          {!props.onDarkMode && (
            <IconWorld
              color={
                computedColorScheme === "light" ? "black" : "white"
              }
            />
          )}
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown
        bg={"#16181e"}
        bd={"none"}
        style={{ border: "none" }}
      >
        <Menu.Item
          aria-checked={activeLanguage === Language.EN}
          className={classes.menuLanguage}
          fw={800}
          onClick={() => {
            onChange(Language.EN);
          }}
        >
          English
        </Menu.Item>
        <Menu.Item
          aria-checked={activeLanguage === Language.JA}
          className={classes.menuLanguage}
          fw={800}
          onClick={() => {
            onChange(Language.JA);
          }}
        >
          日本語
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
