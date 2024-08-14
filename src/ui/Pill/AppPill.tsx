import { Pill, PillProps } from "@mantine/core";
import classes from "./pill.module.scss";

type _TYPES = "Default" | "WithTagSmall";
type Custom = {
  instancetype?: _TYPES;
};
type InstanceProps = PillProps & Partial<Custom>;

const _props: Partial<Record<_TYPES, InstanceProps>> = {
  Default: {},
  WithTagSmall: {
    bg: "blue.1",
    c: "blue.5",
    radius: 5,
    size: "xs",
  },
};

export default function AppPill(props: InstanceProps) {
  return (
    <Pill
      className={classes.appPill}
      {..._props[props.instancetype ?? "Default"]}
      {...props}
    >
      {props.children}
    </Pill>
  );
}
