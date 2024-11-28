import { Box, ComboboxData, Select } from "@mantine/core";
import { IconCaretDownFilled } from "@tabler/icons-react";

type PropsInput = {
  label: string;
  onChange: (v: string | null) => void;
  value: string;
  data: ComboboxData;
};
export function SelectAsMenu(props: PropsInput) {
  return (
    <>
      <Box h={"100%"} w={"100%"}>
        <Select
          label={props.label ? props.label : " "}
          onChange={(v) => props.onChange(v)}
          data={props.data}
          value={props.value}
          withCheckIcon={false}
          rightSection={<IconCaretDownFilled size={14} />}
          rightSectionWidth={30}
          allowDeselect={false}
          classNames={{
            root: "app-select--root",
            option: "app-select-option",
            input: "app-select--input",
            section: "app-select--section",
          }}
          comboboxProps={{
            position: "bottom-end",
            offset: 0,
            withinPortal: true,
          }}
          styles={{
            label: {
              fontSize: "12px",
            },
            wrapper: {
              // height: "100%"
            },
            root: {
              // height: "100%"
            },
            input: {
              border: "none",
              fontSize: "12px",
              textAlign: "center",
              paddingTop: 0,
              paddingBottom: 0,
              paddingLeft: 0,
              // height: "100%"
              background: "light-dark(rgba(0,0,0, 0.05), #26282c)",
            },
            option: {
              fontSize: "12px",
            },
          }}
        />
      </Box>
    </>
  );
}
