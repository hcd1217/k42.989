import { GenericObject } from "@/types";
import { useForm } from "@mantine/form";
import { FormValidateInput } from "@mantine/form/lib/types";
import { useMemo } from "react";

export function useSPEForm<T extends GenericObject>(props: {
  initialValues: T;
  onValuesChange: (values: T, previous: T) => void;
  validate?: FormValidateInput<T>;
}) {
  const form = useForm<T>({ mode: "uncontrolled", ...props });
  const values = useMemo<T>(() => {
    return form.getValues() as T;
  }, [form]);

  return {
    form,
    values,
  };
}
