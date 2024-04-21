import {TRADE_POSITION} from "utils";

export const calculationLiquidity = (entryPrice: number, balance: number, orderValue: number, position: TRADE_POSITION) => {
    if (orderValue <= balance) {
        return 0
    }

    const balanceDifPercent = 100 / (orderValue / balance)
    const liquidity = (entryPrice * balanceDifPercent) / 100

    if (position === TRADE_POSITION.LONG) {
        return entryPrice - liquidity
    } else {
        return entryPrice + liquidity
    }
}