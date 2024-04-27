export const fixedNumber = (num: number | string, fixed: number): number | string => {
    num = Number(num);
    const isInteger = Number.isInteger(num);

    return isInteger ? num : Number(num.toFixed(fixed))
}