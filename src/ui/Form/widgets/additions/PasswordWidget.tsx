import { PasswordInput } from "@mantine/core";
import { WidgetProps } from "@rjsf/utils";
import { useState } from "react";

export const CustomPasswordWidget = function (props: WidgetProps) {
  const [text, setText] = useState<string>(
    (props.value as string) ?? "",
  );
  const { onChange } = props;
  return (
    <>
      <PasswordInput
        value={text}
        onChange={({ target: { value } }) => {
          onChange(value);
          setText(value);
        }}
        type="password"
        placeholder={props.uiSchema?.["ui:placeholder"]}
        error={Boolean(props.rawErrors?.toLocaleString())}
        label={props.label ? props.label : ""}
        {...(props.options?.props as any)} // eslint-disable-line
      />
    </>
  );
};
