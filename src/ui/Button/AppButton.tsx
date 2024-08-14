import {
  BoxProps,
  Button,
  ButtonProps,
  createPolymorphicComponent,
} from "@mantine/core";

import { IconArrowRight } from "@tabler/icons-react";
import { ReactNode, forwardRef } from "react";
import classes from "./appButton.module.scss";

type _TYPES =
  | "Default"
  | "Ghost"
  | "GhostWithRightIcon"
  | "WithRightIcon"
  | "WithOutlinedColor"
  | "WithGradient";

type Instance = ButtonProps;

type Custom = {
  children?: ReactNode;
  instancetype?: _TYPES;
};

const _classes: Partial<Record<_TYPES, string>> = {
  Default: "",
  GhostWithRightIcon: classes.appButton,
};

const _props: Record<_TYPES, InstanceProps> = {
  Default: {},
  Ghost: {
    variant: "transparent",
  },
  GhostWithRightIcon: {
    justify: "space-between",
    fullWidth: true,
    rightSection: <IconArrowRight />,
    variant: "transparent",
    px: "0",
  },
  WithRightIcon: {
    rightSection: <IconArrowRight />,
  },
  WithOutlinedColor: {
    variant: "outline",
  },
  WithGradient: {
    variant: "gradient",
    fullWidth: true,
    size: "sm",
    c: "dark",
    gradient: { from: "primary", to: "yellow", deg: 90 },
  },
};

type InstanceProps = Instance & Custom;

interface MyButtonProps extends BoxProps, InstanceProps {}

const AppButton = createPolymorphicComponent<"button", MyButtonProps>(
  // eslint-disable-next-line react/display-name
  forwardRef<HTMLButtonElement, MyButtonProps>(
    ({ children, ...others }, ref) => {
      const _pr = { ...others };
      return (
        <Button
          {..._props[_pr.instancetype ?? "Default"]}
          className={_classes[_pr.instancetype ?? "Default"]}
          {...others}
          ref={ref}
        >
          {children}
        </Button>
      );
    },
  ),
);

AppButton.displayName = "AppButton"; // Add display name

export default AppButton;
