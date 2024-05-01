import React from "react";
import {v4 as uuidv4} from 'uuid'

import {
    useFuturesTradingModalContext,
    useSimulatorOptionsContext,
    useSimulatorPlayerInfoContext,
    useSimulatorTradingChartDetailsContext
} from "layouts/providers";
import {MODALS, ORDER_STATUS, showNotification, TRADE_POSITION, TRADE_TYPE} from "utils";

import {Input, InputRangeSlider, ModalWindowTemplate} from "components";

import {OrderHistoryLimitMarketITF} from "layouts/providers/type";

import "./style.scss"

const ClosPositionMarket: React.FC = () => {
    const {setCurrentModal} = useFuturesTradingModalContext()
    const {cryptoType} = useSimulatorOptionsContext()
    const {
        confirmedLongPositionData,
        confirmedShortPositionData,
        setOrderHistoryLimitMarket,
        setConfirmedLongPositionData,
        setConfirmedShortPositionData,
        setConfirmedLongPositionDataTPSL,
        setConfirmedShortPositionDataTPSL,
    } = useSimulatorTradingChartDetailsContext()

    const {setBalanceUSDT} = useSimulatorPlayerInfoContext()

    const currentPositionData = confirmedLongPositionData ? confirmedLongPositionData : confirmedShortPositionData
    const currentPosition = confirmedLongPositionData ? TRADE_POSITION.LONG : TRADE_POSITION.SHORT

    const profit = Number((currentPositionData.profit + currentPositionData.realized_pl).toFixed(2))
    const quantity = currentPositionData.calculated_quantity
    const im = currentPositionData.im

    const confirmPreference = () => {
        setBalanceUSDT(prev => prev + im + profit)

        showNotification(`${currentPosition} position closed successfully`, "success", 0)

        let history: OrderHistoryLimitMarketITF = {
            contracts: `${cryptoType}USDT`,
            filled_total: {filled: currentPositionData.calculated_quantity, total: currentPositionData.calculated_quantity},
            filled_price_order_price: {filled_price: currentPositionData.mark_price, order_price: "Market"},
            trade_type: currentPosition === TRADE_POSITION.LONG ? TRADE_TYPE.CLOSE_LONG : TRADE_TYPE.CLOSE_SHORT,
            order_type: "Market",
            status: ORDER_STATUS.FILLED,
            order_No: uuidv4().split("-")[0],
            order_time: new Date(),
            color: currentPosition === TRADE_POSITION.LONG ? "red" : "green",
        }

        setOrderHistoryLimitMarket(prev => [history,...prev])

        if (currentPosition === TRADE_POSITION.LONG) {
            setConfirmedLongPositionData(null)
            setConfirmedLongPositionDataTPSL(null)
        } else {
            setConfirmedShortPositionData(null)
            setConfirmedShortPositionDataTPSL(null)
        }

        setCurrentModal(MODALS.CLOSE)
    }

    const inputHandler = () => {
    }


    return (
        <ModalWindowTemplate show={true} title="Market Close" confirmCallback={confirmPreference} cancelCallback={() => setCurrentModal(MODALS.CLOSE)}>
            <div className="futures-modal_close-position_market">
                <Input
                    value={quantity}
                    type="number"
                    name="quantity"
                    onChange={() => inputHandler()}
                    labelText={`Closed Qty ${cryptoType}`}
                />
                <InputRangeSlider
                    max={100}
                    value={100}
                    division={4}
                    name="percent"
                    disabled={true}
                    onChange={() => inputHandler()}
                />
                <div className="futures-modal_close-position_market_result">
                    {quantity} contract(s) will be closed at Last Traded Price price, and your expected {profit > 0 ? "profit" : "loss"} will be {profit} USDT.
                    (inclusive of est. closing fees)
                </div>
            </div>
        </ModalWindowTemplate>
    )
}

export default ClosPositionMarket