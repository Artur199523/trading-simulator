export const calculateProfitPriceByTrigger = (triggerPrice: number | string, entryPrice: number | string, leverage: number | string, orderValue: number | string) => {
    return Number(((((((Number(triggerPrice) - Number(entryPrice)) * 100) / Number(entryPrice)) * Number(leverage)) * (Number(orderValue) / Number(leverage))) / 100).toFixed(2))
}