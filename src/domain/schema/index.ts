import { FormSchema } from "@/types";
import deepFreeze from "deep-freeze-es6";
import TransferSchema from "./assets/TransferSchema";
import WithdrawSchema from "./assets/WithdrawSchema";
import ForgotPassword from "./authentication/ForgotPasswordSchema";
import ResetPassword from "./authentication/ResetPasswordSchema";
import PostOrderSchema from "./trades/PostOrderSchema";

const _schema: Record<string, FormSchema> = {
  ForgotPassword,
  ResetPassword,
  PostOrderSchema,
  TransferSchema,
  WithdrawSchema,
};

export const schema = deepFreeze(_schema);
