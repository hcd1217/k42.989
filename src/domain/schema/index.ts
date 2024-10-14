import { FormSchema } from "@/types";
import deepFreeze from "deep-freeze-es6";

const _schema: Record<string, FormSchema> = {};

export const schema = deepFreeze(_schema);
