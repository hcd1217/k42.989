import { Box, NumberInput, Slider } from "@mantine/core";
import AppText from "../Text/AppText";
type PropsInput = {
  label: string;
  value: string | number;
  percent: string | number;
  rightTitle: string;
  onChangeInput: (value: string) => void;
  onChangePercent: (value: string) => void;
};
export function InputWithPercent({
  label,
  value,
  percent,
  rightTitle,
  ...props
}: PropsInput) {
  return (
    <>
      <Box>
        <NumberInput
          thousandSeparator=","
          decimalSeparator="."
          classNames={{
            label: "text-label-form",
          }}
          label={label}
          value={value}
          onChange={(v) => props.onChangeInput(v.toString())}
          rightSectionWidth={60}
          rightSection={
            <AppText fz={12} fw={"bold"}>
              {rightTitle}
            </AppText>
          }
          size="sm"
        ></NumberInput>
        <Box py={20} mb={10} px={2}>
          <Slider
            onChange={(v) => props.onChangePercent(v.toString())}
            color="primary"
            size="sm"
            max={100}
            value={parseInt(percent.toString())}
            marks={[
              { value: 0, label: "0%" },
              { value: 25, label: "20%" },
              { value: 50, label: "50%" },
              { value: 75, label: "75%" },
              { value: 100, label: "100%" },
            ]}
            styles={{
              label: {
                fontSize: "10px",
              },
              markLabel: {
                fontSize: "10px",
              },
            }}
          />
        </Box>
      </Box>
    </>
  );
}
