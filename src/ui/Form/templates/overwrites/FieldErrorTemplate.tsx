import useSPETranslation from "@/hooks/useSPETranslation";
import { msgPasswordErr } from "@/utils/validates";
import { Text } from "@mantine/core";
import { FieldErrorProps } from "@rjsf/utils";

function _convert(str: string) {
  if (str.includes("must have required property")) {
    return "Field is required";
  }
  if (str.includes("must match")) {
    return "Invalid value";
  }
  return str;
}
function ErrorMessages({
  errors,
  fieldId,
}: {
  errors: FieldErrorProps["errors"];
  fieldId: string;
}) {
  const t = useSPETranslation();
  const errorMessage = errors?.[0] ?? <></>;
  if (typeof errorMessage === "string") {
    return (
      <>
        <Text
          fz={"xs"}
          c={"red"}
          style={{ position: "static", top: "100%", left: "0" }}
        >
          {fieldId.endsWith("_password")
            ? t(msgPasswordErr)
            : t(_convert(errorMessage))}
        </Text>
      </>
    );
  }
  return errorMessage;
}

export function FieldErrorTemplate({
  errors,
  idSchema,
}: FieldErrorProps) {
  // const t = useSPETranslation();
  if (idSchema.$id === "root") {
    return <></>;
  }
  return <ErrorMessages errors={errors} fieldId={idSchema.$id} />;
}
