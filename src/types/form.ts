import { FormProps } from "@rjsf/core";

export type FormSchema = Omit<FormProps, "validator">;
