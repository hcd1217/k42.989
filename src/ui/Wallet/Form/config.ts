import logger from "@/services/logger";
import {
  SwapFormData,
  TransferAssetsFormData,
  WithdrawFormData,
} from "@/types";

export function convertToSwapFormData(formData: SwapFormData) {
  logger.trace("convertToSwapFormData", formData);
  const symbol =
    formData.side === "SELL"
      ? `${formData.symbolFrom}_${formData.symbolTo}_SPOT`
      : `${formData.symbolTo}_${formData.symbolFrom}_SPOT`;
  return {
    accountId: formData.accountId,
    symbol,
    side: formData.side,
    volume: formData.volume.toString(),
  };
}

export function convertToWithdrawFormData(
  formData: WithdrawFormData,
) {
  const k = formData.coin;
  const infoKey =
    k === "BTC" ? "infoBTC" : k === "ETH" ? "infoETH" : "infoUSDT";
  return {
    coin: formData.coin,
    chain: formData[infoKey].chain,
    address: formData[infoKey].address,
    amount: formData[infoKey].amount,
  };
}

export function convertToTransferFormData(
  formData: TransferAssetsFormData,
) {
  return formData;
}
