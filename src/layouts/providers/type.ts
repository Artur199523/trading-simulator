import React from "react";

import {EXIST_TYPE, HEDGING, HIDDEN_BLOCKS, MARGIN_MODE, MODALS, ORDER_STATUS, POSITION_MODE, TRADE_POSITION, TRADE_TYPE} from "utils";

import {PositionDataITF} from "components/molecules/RightBar/Futures/type";
import {HistoryItem} from "store/simulator/type";
import {ModalContextType} from "utils/types";

export interface SimulatorProviderITF {
    children: React.ReactNode
}

export interface SimulatorOptionsContextITF {
    date: number
    currency: CurrencyT
    interval: IntervalT
    cryptoType: CryptoTypeT
    setDate: (date: number) => void
    setInterval: (interval: IntervalT) => void
    setCurrency: (currency: CurrencyT) => void
    setCryptoType: (crypto: CryptoTypeT) => void
}

export interface SimulatorToolsContextITF {
    next: boolean
    isPlay: boolean
    isStart: boolean
    currentSpeed: CurrentSpeedT
    setNext: (isNext: boolean) => void
    setIsPlay: (isPlay: boolean) => void
    setIsStart: (isStart: boolean) => void
    setCurrentSpeed: (speed: CurrentSpeedT) => void
}

export interface SimulatorTradingContextITF {
    riskLimit: number
    process: ProcessT
    adjustLeverage: number
    marginMode: MARGIN_MODE
    tradingType: TradingType
    positionMode: POSITION_MODE
    processFutures: PositionFuturesT
    orderPlacementPreference: string
    currentHedgingModePositionType: HEDGING
    setRiskLimit: (limit: number) => void
    setProcess: (process: ProcessT) => void
    setMarginMode: (mode: MARGIN_MODE) => void
    setAdjustLeverage: (amount: number) => void
    setPositionMode: (mode: POSITION_MODE) => void
    setTradingType: (trading: TradingType) => void
    setProcessFutures: (position: PositionFuturesT) => void
    setOrderPlacementPreference: (preference: string) => void
    setCurrentHedgingModePositionType: (type: HEDGING) => void
}

export interface SimulatorPlayerInfoContextITF {
    balanceUSDT: number
    balanceTradeableCrypto: number
    totalDepositWithLeverage: number
    setBalanceUSDT: (balance: (prev: number) => number) => void
    setTotalDepositWithLeverage: (deposit: number) => void
    setBalanceTradeableCrypto: (balance: (prev: number) => number) => void
}

export interface SimulatorTradingChartDetailsContextITF {
    limitOrders: OrderITF[]
    marketOrders: OrderITF[]
    currentCryptoData: HistoryItem
    tradeHistory: TradeHistoryITF[]
    stopLimitOrders: StopOrderITF[]
    limitOrdersMarks: OrderMarkITF[]
    marketOrdersMarks: OrderMarkITF[]
    longPositionDataTPSL: PositionITF
    stopLimitPreOrders: StopOrderITF[]
    shortPositionDataTPSL: PositionITF
    stopLimitOrdersMarks: OrderMarkITF[]
    orderHistoryTPSL: OrderHistoryTPSLITF[]
    profitLossHistory: ProfitLossHistoryITF[]
    currentOrdersTPSL: CurrentOrdersTPSLITF[]
    confirmedLongPositionDataTPSL: PositionITF
    confirmedShortPositionDataTPSL: PositionITF
    confirmedLongPositionData: ConfirmedPositionData
    confirmedShortPositionData: ConfirmedPositionData
    orderHistoryConditional: OrderHistoryConditionalITF[]
    orderHistoryLimitMarket: OrderHistoryLimitMarketITF[]
    confirmedLongPositionDataHistory: ConfirmedPositionData[]
    confirmedShortPositionDataHistory: ConfirmedPositionData[]
    setCurrentCryptoData: (data: HistoryItem) => void
    setLongPositionDataTPSL: (position: PositionITF) => void
    setShortPositionDataTPSL: (position: PositionITF) => void
    serOrderHistoryTPSL: (history: OrderHistoryTPSLITF[]) => void
    setLimitOrders: (order: (prev: OrderITF[]) => any[]) => void
    setConfirmedLongPositionDataTPSL: (tpsl: PositionITF) => void
    setConfirmedShortPositionDataTPSL: (tpsl: PositionITF) => void
    setMarketOrders: (order: (prev: OrderITF[]) => OrderITF[]) => void
    setConfirmedLongPositionData: (position: ConfirmedPositionData) => void
    setConfirmedShortPositionData: (position: ConfirmedPositionData) => void
    setLimitOrdersMarks: (mark: (prev: OrderMarkITF[]) => OrderMarkITF[]) => void
    setStopLimitOrders: (order: (prev: StopOrderITF[]) => StopOrderITF[]) => void
    setMarketOrdersMarks: (mark: (prev: OrderMarkITF[]) => OrderMarkITF[]) => void
    setStopLimitPreOrders: (order: (prev: StopOrderITF[]) => StopOrderITF[]) => void
    setStopLimitOrdersMarks: (mark: (prev: OrderMarkITF[]) => OrderMarkITF[]) => void
    setTradeHistory: (history: (prev: TradeHistoryITF[]) => TradeHistoryITF[]) => void
    setCurrentOrdersTPSL: (order: (prev: CurrentOrdersTPSLITF[]) => CurrentOrdersTPSLITF[]) => void
    setProfitLossHistory: (history: (prev: ProfitLossHistoryITF[]) => ProfitLossHistoryITF[]) => void
    setOrderHistoryLimitMarket: (order: (prev: OrderHistoryLimitMarketITF[]) => OrderHistoryLimitMarketITF[]) => void
    setOrderHistoryConditional: (history: (prev: OrderHistoryConditionalITF[]) => OrderHistoryConditionalITF[]) => void
    setConfirmedLongPositionDataHistory: (positionHistory: (prev: ConfirmedPositionData[]) => ConfirmedPositionData[]) => void
    setConfirmedShortPositionDataHistory: (positionHistory: (prev: ConfirmedPositionData[]) => ConfirmedPositionData[]) => void
}

export interface OrderITF {
    date: Date
    side: SideT
    type: TypeT
    last: number
    price: number
    symbol: SymbolT
    status: StatusT
    quantity: number
    order_id: number
    stop_price: number
    limit_price: number
}

export interface StopOrderITF extends OrderITF {
    fee: number
    total: number
    isActive: boolean
    influence: InfluenceT
}

export interface OrderMarkITF {
    id: string
    time: number
    text: string
    color: string
    shape: MarkShapeT
    position: MarkPositionT
}

export interface ModalsContextITF {
    children: React.ReactNode
}

export interface PositionITF extends PositionDataITF {
}

type ReducedModalContextType<T> = Omit<ModalContextType<T>, 'dataForModal' | 'setDataForModal'>;

export interface EnhancedModalContextType<T> extends ReducedModalContextType<MODALS> {
    dataForModal: T
    setDataForModal: React.Dispatch<React.SetStateAction<T>>
}

export interface EnhancedHiddenBlockContextType {
    hiddenBlock: HIDDEN_BLOCKS
    setHiddenBlock: React.Dispatch<React.SetStateAction<HIDDEN_BLOCKS>>
}

export interface ConfirmedPositionData {
    id: string
    im: number
    mm: number
    value: number
    profit?: number
    leverage: number
    percent?: number
    mark_price: number
    order_cost: number
    entry_price: number
    realized_pl: number
    position: TRADE_POSITION
    tp_sl: React.JSX.Element
    calculated_quantity: number
    close_by: React.JSX.Element
    quantity: React.JSX.Element
    mmr_close: React.JSX.Element
    contracts: React.JSX.Element
    liquidity_price: number | string
    trailing_stop: React.JSX.Element
    unrealized_pl: React.JSX.Element
    reverse_position: React.JSX.Element
}


export interface ProfitLossHistoryITF {
    quantity: number
    contracts: string | React.JSX.Element
    closed_pl: number
    exit_price: number
    trade_time: Date | string
    entry_price: number
    exit_type: EXIST_TYPE
    trade_type: TRADE_TYPE | React.JSX.Element
    color: OrderColorT
}

export interface CurrentOrdersTPSLITF {
    contracts: string
    quantity: string
    trigger_price: { tp: number, sl: number }
    order_price: string
    trade_type: TRADE_TYPE
    order_No: string
    order_time: Date
    color: OrderColorT
}

export interface OrderHistoryLimitMarketITF {
    contracts: string
    filled_total: { filled: number, total: number }
    filled_price_order_price: { filled_price: number, order_price: string }
    trade_type: TRADE_TYPE
    order_type: string
    status: ORDER_STATUS
    order_No: string
    order_time: Date
    color: OrderColorT
}

export interface OrderHistoryConditionalITF {
    contracts: string
    filled_actual_qty: string
    filled_price_order_price: { filled_price: number, order_price: number }
    trigger_price: number
    trade_type: TRADE_TYPE
    status: StatusT
    order_No: string
    order_time: string
}

export interface OrderHistoryTPSLITF {
    contracts: string
    filled_actual_qty: { filled: number, actual_qty: number }
    trigger_price: number
    filled_price_order_price: { filled_price: number, order_price: string }
    trade_type: TRADE_TYPE
    status: ORDER_STATUS
    order_No: string
    order_time: string
    color: OrderColorT
}

export interface TradeHistoryITF {
    contracts: string
    filled_total: { filled: number, total: number }
    filled_price_order_price: { filled_price: number, order_price: string }
    trade_type: TRADE_TYPE
    order_type: string
    filled_type: string
    transaction_id: string
    transaction_time: Date
    color: OrderColorT
}

export type OrderColorT = "red" | "green"

export type SymbolT = "ETH" | "BTC" | ""

export type SideT = "Buy" | "Sell" | ""

export type TypeT = "Market" | "Limit" | "Stop" | ""

export type StatusT = "Filled" | "Working" | "Cancelled" | "Disabled" | ""

export type IntervalT = "histominute"

export type CurrencyT = "USD" | "EUR"

export type CryptoTypeT = "ETH" | "BTC"

export type CurrentSpeedT = 1 | 3 | 10

export type TradingType = "spot" | "futures"

export type ProcessT = "buy" | "sell" | ""

export type PositionFuturesT = "long" | "short"

export type MarkPositionT = "aboveBar" | "belowBar" | "inBar"

export type MarkShapeT = "circle" | "arrowUp" | "arrowDown" | "triangleUp" | "triangleDown"

export type StopLimitOrderT = "order-confirm" | ""

export type InfluenceT = "up" | "down" | ""

export type HedgingModeTypeT = "open" | "close"