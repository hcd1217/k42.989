import { APP_CONFIG } from "@/common/configs";
import authStore from "@/store/auth";
import { FiatDepositRecords } from "@/ui/Wallet";
import { Navigate } from "react-router-dom";

export default function FiatDeposit() {
  const { me } = authStore();
  return APP_CONFIG.FIAT_DEPOSIT && me?.fiatDepositMemo ? (
    <FiatDepositRecords />
  ) : (
    <Navigate to="/" />
  );
}
