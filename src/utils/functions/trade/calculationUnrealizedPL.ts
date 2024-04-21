export const calculationUnrealizedPL = (quantity: number | string, entryPrice: number | string, lastTriggerPrice: number | string) => {
    return Number(quantity) * (Number(entryPrice) - Number(lastTriggerPrice))
}