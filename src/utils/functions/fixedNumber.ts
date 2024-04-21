export const fixedNumber = (num: number,fixed:number): number | string =>{
    const isInteger = Number.isInteger(num);

    return  isInteger ? num : Number(num.toFixed(fixed))
}