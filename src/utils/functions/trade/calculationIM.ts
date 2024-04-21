export const calculationIM = (orderValue: string | number, leverage: string | number) => {
    return Number(orderValue) / Number(leverage)
}