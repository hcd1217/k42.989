/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  Badge,
  Button,
  Checkbox,
  Flex,
  Grid,
  Menu,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { ReactNode, useCallback, useMemo, useState } from "react";
import AppButton from "../Button/AppButton";

type FilterOption = {
  value: string;
  label: string;
};
export function OptionFilterAsCheckbox(
  props: Partial<{
    label: string;
    items: FilterOption[];
    icon: ReactNode;
  }>,
) {
  const [values, setValues] = useState<{ [k in string]: boolean }>(
    {},
  );
  const [confirmed, setConfirm] = useState<boolean>(false);
  const setValue = useCallback(
    (val: string) => {
      const _values = { ...values };
      if (val in _values) {
        _values[val] = !_values[val];
      } else {
        _values[val] = true;
      }
      setValues((pr) => {
        return {
          ...pr,
          ..._values,
        };
      });
    },
    [values],
  );
  const checked = useMemo(() => {
    return Object.keys(values)
      .map((i) => Boolean(values[i]))
      .filter((i) => i === true);
  }, [values]);
  return (
    <>
      <Menu
        returnFocus
        closeOnItemClick={false}
        position="bottom-start"
        shadow="md"
        width={300}
        transitionProps={{ transition: "fade-down", duration: 150 }}
      >
        <Menu.Target>
          <Button color="dark" p={0} variant="transparent">
            <Flex align={"center"} gap={5}>
              {props.label ?? "_menu"}
              {confirmed && checked.length > 0 && (
                <Badge size="xs" color="primary.4">
                  {checked.length}
                </Badge>
              )}
              {props.icon ? (
                props.icon
              ) : (
                <IconChevronDown size={18} color="gray" />
              )}
            </Flex>
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>{props.label ?? "label"}</Menu.Label>
          {props.items?.map((item, i) => (
            <Menu.Item key={i} style={{ position: "relative" }}>
              <Checkbox
                w={"100%"}
                h={"100%"}
                fw={"bold"}
                id={`md_${item.value}_mn`}
                defaultChecked
                iconColor="dark.8"
                size="sm"
                label={item.label}
                value={item.value}
                checked={values[item.value] === true}
                onChange={() => setValue(item.value)}
              />
              <label
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  top: 0,
                  left: 0,
                }}
                htmlFor={`md_${item.value}_mn`}
              />
            </Menu.Item>
          ))}

          <Menu.Divider />
          <Menu.Item>
            <Grid>
              <Grid.Col span={6}>
                <AppButton
                  onClick={() => {
                    setConfirm(false);
                    setValues({});
                  }}
                  disabled={checked.length === 0}
                  variant="default"
                  w={"100%"}
                >
                  Reset
                </AppButton>
              </Grid.Col>
              <Grid.Col span={6}>
                <AppButton
                  onClick={() => setConfirm(true)}
                  w={"100%"}
                >
                  Confirm
                </AppButton>
              </Grid.Col>
            </Grid>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
