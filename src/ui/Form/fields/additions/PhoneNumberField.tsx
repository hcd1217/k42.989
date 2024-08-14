import { TextInput } from "@mantine/core";
import { FieldProps } from "@rjsf/utils";
import { FC, useState } from "react";

export const PhoneNumberField: FC<FieldProps<string>> = ({
  onChange,
  title,
  required,
  formData,
  rawErrors,
}) => {
  const [text] = useState<string>(formData || "");
  const [_title] = useState<string>(
    title ? (required ? title + "*" : title) : "",
  );
  return (
    <div>
      <TextInput
        label={_title}
        value={text || ""}
        onChange={({ target: { value } }) => {
          onChange(value);
        }}
        error={rawErrors?.toLocaleString()}
      />
    </div>
  );
};
