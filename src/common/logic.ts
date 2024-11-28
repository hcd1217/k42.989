import BN from "./big-number";
import { MMR } from "./configs";
import { AccountType, OrderSide } from "./enums";
import { SPENumber } from "./types";

export function positionMargin(
  price: SPENumber,
  volume: SPENumber,
  leverage: SPENumber,
) {
  return BN.add(
    initialMargin(price, volume, leverage),
    maintenanceMargin(price, volume),
  );

  function initialMargin(
    price: SPENumber,
    volume: SPENumber,
    leverage: SPENumber,
  ) {
    return BN.div(BN.mul(price, volume), leverage);
  }

  function maintenanceMargin(price: SPENumber, volume: SPENumber) {
    let value = BN.mul(price, volume);
    return MMR.reduce((acc, [limit, rate]) => {
      if (BN.eq(value, "0")) {
        return acc;
      }
      const _val = BN.min(value, limit);
      value = BN.sub(value, _val);
      return BN.add(acc, BN.mul(_val, rate));
    }, "0");
  }
}

export function isTradingAccount(account: {
  type: AccountType;
  isFunding: boolean;
}) {
  if (account.type === AccountType.MAIN) {
    return !account.isFunding;
  }
  return false;
}

export function isFundingAccount(account: {
  type: AccountType;
  isFunding: boolean;
}) {
  if (account.type === AccountType.MAIN) {
    return account.isFunding;
  }
  return false;
}

export function maxVolume(
  freeAmount: number,
  price: number,
  side: OrderSide,
) {
  return Number(
    side === OrderSide.BUY ? BN.div(freeAmount, price) : freeAmount,
  );
}

export function profit(
  entryPrice: SPENumber,
  markPrice: SPENumber,
  volume: SPENumber,
  side: OrderSide,
  fee: SPENumber = 0,
) {
  /*
    futures:
      entry
        BUY 1BTC@Price10,000
          value = $10,000
          leverage = 10
          locked $10,000 / 10 = %1,000
          borrow $9,000

        entryValue = entryPrice * volume
        entryCommission = entryValue * commissionRate
        maintenanceMargin = entryValue / leverage
        borrowValue = entryValue - maintenanceMargin
      funding
        fundingFee = borrowValue * fundingRate
        fundingFee = entryValue * fundingRate
      close
        closeValue = closePrice * volume
        entryCommission = closeValue * commissionRate

      unrealizedPnL = ...
      realizedPnL =
          closeValue
          - entryValue
          - entryCommission
          - closeCommission
          - fundingFee x days x 3

  */
  return BN.add(
    fee,
    BN.mul(
      BN.sub(markPrice, entryPrice),
      volume,
      side === OrderSide.BUY ? 1 : -1,
    ),
  );
}
