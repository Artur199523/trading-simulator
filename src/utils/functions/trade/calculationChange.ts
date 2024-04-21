export const calculationChange = (entryPrice: number | string, triggerPrice: number | string): number => {
    entryPrice = Number(entryPrice)
    triggerPrice = Number(triggerPrice)

    return ((triggerPrice - entryPrice)) * 100 / entryPrice
}