import React from "react";

import {format} from "date-fns";

import {useSimulatorTradingChartDetailsContext} from "layouts/providers";
import {interruptionRef, PROFIT_LOSS, TRADE_TYPE} from "utils";

import Contracts from "../components/Contracts";
import {FlexibleTable} from "components";

import {ProfitLossHistoryITF} from "layouts/providers/type";
import TradeType from "../components/TradeType";

const ProfitLoss: React.FC = () => {
    const {profitLossHistory} = useSimulatorTradingChartDetailsContext()

    const convertData = () => {
        const data = interruptionRef(profitLossHistory)

        return data.map((order: ProfitLossHistoryITF) => {
            const {
                contracts,
                color,
                trade_type,
                trade_time,
                quantity,
                entry_price,
                exit_price,
                closed_pl,
                exit_type
            } = order

            order.trade_time = format(trade_time, "yyyy-MMM-dd hh:mm:ss") as string
            order.contracts = <Contracts value={contracts as string} color={color}/>
            order.trade_type = <TradeType value={trade_type as TRADE_TYPE} color={color}/>
            order.quantity = quantity
            order.entry_price = entry_price
            order.exit_price = exit_price
            order.closed_pl = closed_pl
            order.exit_type = exit_type

            return order
        })
    }

    return <FlexibleTable header={PROFIT_LOSS} body={convertData()}/>
}

export default ProfitLoss