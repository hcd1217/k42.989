import { Button } from "@mantine/core";
import {
  SubmitButtonProps,
  getSubmitButtonOptions,
} from "@rjsf/utils";

export function SubmitButton(props: SubmitButtonProps) {
  const { uiSchema } = props;
  const { norender } = getSubmitButtonOptions(uiSchema);
  if (norender) {
    return null;
  }

  return (
    <Button
      type="submit"
      variant="gradient"
      gradient={{ from: "primary", to: "yellow", deg: 90 }}
      {...uiSchema?.["ui:options"]?.["submitButtonOptions"]?.props}
    >
      {uiSchema?.["ui:options"]?.["submitButtonOptions"]
        ?.submitText ?? "Submit"}
    </Button>
  );
}
