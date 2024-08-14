import { TextInput } from "@mantine/core";
import { WidgetProps } from "@rjsf/utils";
import { useState } from "react";

export const TextWidget = function (props: WidgetProps) {
  const [text, setText] = useState<string>(props.value);
  return (
    <>
      <TextInput
        value={text || ""}
        onChange={({ target: { value } }) => {
          if (value === "") {
            props.onChange(undefined);
          } else {
            props.onChange(value);
          }
          setText(value);
        }}
        placeholder={props.uiSchema?.["ui:placeholder"]}
        error={Boolean(props.rawErrors?.toLocaleString())}
        readOnly={props.readonly}
        disabled={props.readonly}
        label={props.label ? props.label : ""}
        {...(props.options?.props as any)} // eslint-disable-line
      />
    </>
  );
};
