export function getExplorerUrl(txHash?: string) {
  if (!txHash) return;
  if (_isInternalTransaction(txHash)) {
    return { label: "Internal", value: "" };
  } else if (_isEtherscanTransaction(txHash)) {
    return {
      label: "EtherScan",
      value: `https://etherscan.io/tx/${txHash}`,
    };
  } else if (_isTronScanTransaction(txHash)) {
    return {
      label: "TronScan",
      value: `https://tronscan.org/#/transaction/${txHash}`,
    };
  }
}

export function shortAddress(address?: string) {
  if (!address) return "--";
  return address.slice(0, 6) + "..." + address.slice(-4);
}

function _isTronScanTransaction(txHash: string): boolean {
  const tronPattern = /^[a-fA-F0-9]{64}$/;
  return tronPattern.test(txHash);
}

function _isEtherscanTransaction(txHash: string): boolean {
  const ethereumPattern = /^0x[a-fA-F0-9]+$/;
  return ethereumPattern.test(txHash);
}

function _isInternalTransaction(txHash: string): boolean {
  const internalPattern = /^i\.[a-zA-Z0-9]{25}\.[a-zA-Z0-9]{13}\..*$/;
  return internalPattern.test(txHash);
}
