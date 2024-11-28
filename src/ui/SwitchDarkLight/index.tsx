import {
  ActionIcon,
  lighten,
  useComputedColorScheme,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
const debug = false;

type PropsType = {
  onDarkMode?: boolean;
};

export function SwitchDarkLightMode(
  props: PropsType = {
    onDarkMode: true,
  },
) {
  const theme = useMantineTheme();
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  return (
    <>
      {!debug && (
        <ActionIcon
          onClick={() =>
            setColorScheme(
              computedColorScheme === "light" ? "dark" : "light",
            )
          }
          size="xl"
          variant="transparent"
          aria-label="Toggle color scheme"
        >
          {colorScheme === "light" && (
            <>
              {props.onDarkMode && (
                <IconSun color={lighten(theme.colors.dark[7], 1)} />
              )}
              {!props.onDarkMode && (
                <IconSun
                  color={
                    computedColorScheme === "light"
                      ? "black"
                      : "white"
                  }
                />
              )}
            </>
          )}
          {colorScheme === "dark" && (
            <>
              {props.onDarkMode && (
                <IconMoon color={lighten(theme.colors.dark[7], 1)} />
              )}
              {!props.onDarkMode && (
                <IconMoon
                  color={
                    computedColorScheme === "light"
                      ? "black"
                      : "white"
                  }
                />
              )}
            </>
          )}
        </ActionIcon>
      )}
    </>
  );
}
