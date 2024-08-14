import { Text } from "@mantine/core";
import { FieldTemplateProps } from "@rjsf/utils";
import clsx from "clsx";

export function FieldTemplate(props: FieldTemplateProps) {
  const {
    id,
    classNames,
    style,
    label,
    help,
    required,
    description,
    errors,
    children,
    hidden,
  } = props;
  if (hidden) {
    return <></>;
  }
  return (
    <div className={clsx(classNames, "rowItem")} style={style}>
      {props.displayLabel && (
        <Text component="label" htmlFor={id} fw={"bold"}>
          {label}
          <span style={{ color: "red" }}>
            {required ? "*" : null}
          </span>
        </Text>
      )}

      {description}
      {children}
      {errors}
      {help}
    </div>
  );
}
