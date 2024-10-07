import { FormSchema } from "@/types";
import deepFreeze from "deep-freeze-es6";

import PostOrderSchema from "./trades/PostOrderSchema";

const _schema: Record<string, FormSchema> = {
  PostOrderSchema,
};

export const schema = deepFreeze(_schema);
