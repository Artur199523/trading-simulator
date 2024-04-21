import {calculationIM} from "./calculationIM";

export const calculationMM = (leverage: number | string, percent: number, orderValue: number | string) => {
    const IM = calculationIM(orderValue, leverage)

    return ((Number(leverage) * percent) * IM) / 100
}