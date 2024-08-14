import {
  Flex,
  Menu,
  MenuDropdownProps,
  MenuProps,
  MenuTargetProps,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { ReactNode, useCallback, useState } from "react";
import AppButton from "../Button/AppButton";

type FilterOption = {
  value: string;
  label: string;
};
export function OptionFilter(
  props: Partial<{
    disabled?: boolean;
    label: string;
    value?: string;
    items: FilterOption[];
    icon: ReactNode;
    menuProps: MenuProps;
    menuTargetProps: MenuTargetProps;
    menuDropdownProps: MenuDropdownProps;
    onChange?: (value: string) => void;
  }>,
) {
  const [values, setValues] = useState<string>(
    props.label ?? props.value ?? (props?.items?.[0].value as string),
  );

  const onChange = useCallback(
    (value: string) => {
      setValues(value);
      props?.onChange && props.onChange(value);
    },
    [setValues, props],
  );

  return (
    <>
      <Menu
        position="bottom-start"
        shadow="md"
        width={200}
        withinPortal
        disabled={props.disabled}
        transitionProps={{ transition: "fade-down", duration: 150 }}
        {...props.menuProps}
      >
        <Menu.Target {...props.menuTargetProps}>
          <AppButton
            p={0}
            variant="transparent"
            color="dark"
            styles={{
              label: {
                color: "light-dark(black, white)",
              },
            }}
          >
            <Flex
              align={"center"}
              gap={5}
              style={{
                cursor: props.disabled ? "not-allowed" : "pointer",
              }}
            >
              {values ?? props.label ?? "_menu"}
              {props.icon ? (
                props.icon
              ) : (
                <IconChevronDown size={18} color="gray" />
              )}
            </Flex>
          </AppButton>
        </Menu.Target>

        {!props.disabled && (
          <Menu.Dropdown {...props.menuDropdownProps}>
            {props.items?.map((item, i) => (
              <Menu.Item
                key={i}
                onClick={() => onChange(item.value)}
                fw={"bold"}
                value={item.value}
                c={item.value === values ? "primary" : ""}
              >
                {item.label}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        )}
      </Menu>
    </>
  );
}
