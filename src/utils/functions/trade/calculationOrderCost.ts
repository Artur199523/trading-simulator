// Long Positions
// Order Cost = Initial Margin + Fee to Open Position + Fee to Close Position

// Initial Margin = (Order Price × Order Quantity) / Leverage
// Fee to Open Position = Order Price × Order Price × Taker Fee Rate / 100
// Fee to Close Position = Order Price × Bankruptcy Price × Taker Fee Rate / 100
// Bankruptcy Price for Long Position = Order Price × ( Leverage − 1) / Leverage

export const calculationOrderCostLongPosition = (order_value: number | string, leverage: number | string, percent: number) => {
    const initialMargin = Number(order_value) / Number(leverage)
    const bankruptcyPrice = Number(order_value) * (Number(leverage) - 1) / Number(leverage)

    const feeToOpenPosition = (Number(order_value) * percent) / 100
    const feeToClosePosition = (bankruptcyPrice * percent) / 100

    return initialMargin + feeToClosePosition + feeToOpenPosition
}

// Short Positions
// Order Cost = Initial Margin + Fee to Open Position + Fee to Close Position

// Initial Margin = (Order Price × Order Quantity) / Leverage
// Fee to Open Position = Order Price × Order Price × Taker Fee Rate / 100
// Fee to Close Position = Order Price × Bankruptcy Price × Taker Fee Rate / 100
// Bankruptcy Price for Short Position = Order Price × ( Leverage + 1) / Leverage

export const calculationOrderCostShortPosition = (order_value: number | string, leverage: number | string, percent: number) => {
    const initialMargin = Number(order_value) / Number(leverage)
    const bankruptcyPrice = Number(order_value) * (Number(leverage) + 1) / Number(leverage)

    const feeToOpenPosition = (Number(order_value) * percent) / 100

    const feeToClosePosition = (bankruptcyPrice * percent) / 100

    return initialMargin + feeToClosePosition + feeToOpenPosition
}


