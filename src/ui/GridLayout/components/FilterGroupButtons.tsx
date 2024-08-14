import { Box, Flex, SegmentedControl } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";

type FilterButtons = {
  value: string;
  label: string | React.ReactNode;
  order: number;
  pos: "right" | "left";
};

type FilterGroupButtonsType = {
  items: FilterButtons[];
  value?: string;
  valueRight?: string;
  onChange?: (values: string[], valuesRight: string[]) => void;
};
export function FilterGroupButtons({
  ...props
}: FilterGroupButtonsType) {
  const [filterValues, setFilterValues] = useState<string[]>([
    props.value as string,
  ]);

  // prettier-ignore
  const [filterValuesRight, setFilterValuesRight] = useState<string[]>([props.valueRight as string]);

  useEffect(() => {
    const left =
      (props.items
        .filter((i) => i?.pos === "left")
        .sort((a, b) => a?.order - b?.order) as FilterButtons[]) ??
      [];
    const right =
      (props.items
        .filter((i) => i?.pos === "right")
        .sort((a, b) => a?.order - b?.order) as FilterButtons[]) ??
      [];
    if (left.length > 0) {
      setFilterValues([left[0].value]);
    }
    if (right.length > 0) {
      setFilterValuesRight([right[0].value]);
    }
  }, [props.items]);

  useEffect(() => {
    if (props.onChange) {
      // props.onChange(filterValues, filterValuesRight);
    }
  }, [filterValues, filterValuesRight, props.onChange]);

  const _items = useMemo(() => {
    const left = props.items
      .filter((i) => i?.pos === "left")
      .sort((a, b) => a?.order - b?.order) as FilterButtons[];
    const right = props.items
      .filter((i) => i?.pos === "right")
      .sort((a, b) => a?.order - b?.order) as FilterButtons[];
    return {
      left,
      right,
    };
  }, [props.items]);

  const setValueLeft = (v: string) => {
    if (props.onChange) {
      props.onChange([v], filterValuesRight);
    }
    setValue(v);
  };
  const setValueRight = (v: string) => {
    if (props.onChange) {
      props.onChange(filterValues, [v]);
    }
    setValueR(v);
  };
  const [value, setValue] = useState(props.value);
  const [valueR, setValueR] = useState(props.value);

  return (
    <>
      <Flex gap={12} my={10} align={"center"}>
        <SegmentedControl
          onChange={setValueLeft}
          data={_items.left}
          withItemsBorders={false}
          value={value}
          styles={{
            control: {},
            root: {
              padding: "0px",
              gap: 10,
              background: "none",
            },
            label: {
              fontWeight: "bold",
            },
          }}
          size={"xs"}
        />
        <Box>
          <Box
            h={20}
            w={1}
            style={{
              background:
                "light-dark(#f4f6f7, var(--mantine-color-dark-filled))",
            }}
          />
        </Box>
        <SegmentedControl
          onChange={setValueRight}
          data={_items.right}
          withItemsBorders={false}
          value={valueR}
          styles={{
            control: {},
            root: {
              padding: "0px",
              gap: 10,
              background: "none",
            },
            label: {
              fontWeight: "bold",
            },
          }}
          size={"xs"}
        />
      </Flex>
    </>
  );
}
