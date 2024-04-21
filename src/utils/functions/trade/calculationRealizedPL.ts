export const calculationRealizedPL = (quantity: number | string, entryPrice: number | string, percent: number) => {
    return (Number(quantity) * Number(entryPrice) * percent) / 100
}