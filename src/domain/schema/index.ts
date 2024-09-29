import { FormSchema } from "@/types";
import deepFreeze from "deep-freeze-es6";
import TransferSchema from "./assets/TransferSchema";
import WithdrawSchema from "./assets/WithdrawSchema";
import ForgotPassword from "./authentication/ForgotPasswordSchema";
import LoginForm from "./authentication/LoginFormSchema";
import ResetPassword from "./authentication/ResetPasswordSchema";
import SignUp from "./authentication/SignUpSchema";
import PostOrderSchema from "./trades/PostOrderSchema";

const _schema: Record<string, FormSchema> = {
  SignUp: SignUp,
  ForgotPassword,
  ResetPassword,
  Login: LoginForm,
  PostOrderSchema,
  TransferSchema,
  WithdrawSchema,
};

export const schema = deepFreeze(_schema);
