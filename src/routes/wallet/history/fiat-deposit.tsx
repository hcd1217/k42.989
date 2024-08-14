import authStore from "@/store/auth";
import { FiatDepositRecords } from "@/ui/Wallet";
import { Navigate } from "react-router-dom";

export default function FiatDeposit() {
  const { me } = authStore();
  return me?.fiatDepositMemo ? (
    <FiatDepositRecords />
  ) : (
    <Navigate to="/" />
  );
}
