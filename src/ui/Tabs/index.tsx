import {
  Flex,
  Tabs,
  TabsListProps,
  TabsPanelProps,
  TabsProps,
  TabsTabProps,
} from "@mantine/core";
import cx from "clsx";
import { ReactNode, useState } from "react";

type Variant =
  | "Default"
  | "WithCopyTradeDetail"
  | "WithSmallOnMenu"
  | "WithMediumNoBorder";

type TabType = {
  data: Partial<{
    value: string;
    label: string | React.JSX.Element;
    options: unknown;
  }>;
  tabProp: TabsTabProps;
  tabsPanelProps: Omit<TabsPanelProps, "children"> & {
    children?: ReactNode;
    childrenRenderer?: () => ReactNode;
  };
};

type CustomAppTabsProps = {
  variant?: Variant;
  tabs: Partial<TabType>[];
  tablist: TabsListProps;
  showPanel: boolean;
  leftSection: ReactNode;
  rightSection: ReactNode;
};

type AppTabsProps = TabsProps & Partial<CustomAppTabsProps>;

const CLASS_NAMES: Record<Variant, string> = {
  Default: "",
  WithCopyTradeDetail: "WithCopyTradeDetail",
  WithSmallOnMenu: "WithSmallOnMenu",
  WithMediumNoBorder: "WithMediumNoBorder",
};

export default function AppTabs({
  rightSection,
  leftSection,
  showPanel,
  value,
  defaultValue,
  variant = "Default",
  onChange,
  tablist,
  ...props
}: Partial<AppTabsProps>) {
  const [activeTab, setActiveTab] = useState(
    value || defaultValue || "",
  );
  return (
    <Tabs
      value={value}
      defaultValue={defaultValue}
      className={cx(CLASS_NAMES[variant] || "", props.className)}
      onChange={(value) => {
        setActiveTab(value || "");
        onChange?.(value);
      }}
      {...props}
    >
      <Flex align={"center"} gap={10} className="tabs-header">
        {leftSection}
        <Tabs.List {...tablist} flex={1}>
          {(props.tabs as TabType[]).map((item, idx) => (
            <Tabs.Tab
              {...item.tabProp}
              key={idx}
              value={item.data.value as string}
            >
              {item.data.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {rightSection}
      </Flex>
      {Boolean(showPanel) &&
        (props.tabs as TabType[]).map(
          (
            {
              data,
              tabsPanelProps: {
                children,
                childrenRenderer,
                ...tabsPanelProps
              },
            },
            idx,
          ) => (
            <Tabs.Panel
              key={idx}
              {...tabsPanelProps}
              value={data.value || ""}
            >
              {data.value === activeTab ? (
                children ? (
                  children
                ) : (
                  childrenRenderer?.()
                )
              ) : (
                <> </>
              )}
            </Tabs.Panel>
          ),
        )}
    </Tabs>
  );
}
