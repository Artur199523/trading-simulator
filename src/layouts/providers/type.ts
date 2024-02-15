import React from "react";
import {HistoryItem} from "store/simulator/type";

export interface SimulatorProviderITF {
    children: React.ReactNode
}

export interface SimulatorContextITF {
    next: boolean
    isPlay: boolean,
    isStart: boolean,
    process: ProcessT,
    USDTBalance: number,
    currency: CurrencyT,
    interval: IntervalT,
    cryptoType: CryptoTypeT,
    tradingType: TradingType,
    currentCryptoData: HistoryItem | {},
    currentSpeed: CurrentSpeedT,
    currentCryptoBalance: number,
    setNext: (isNext: boolean) => void,
    setUSDTBalance: (USDT: number) => void,
    setIsPlay: (isPlay: boolean) => void,
    setIsStart: (isStart: boolean) => void,
    setProcess: (process: ProcessT) => void,
    setInterval: (interval: IntervalT) => void,
    setCurrency: (currency: CurrencyT) => void,
    setCryptoType: (crypto: CryptoTypeT) => void,
    setCurrentCryptoData: (data: HistoryItem) => void,
    setTradingType: (trading: TradingType) => void,
    setCurrentSpeed: (speed: CurrentSpeedT) => void,
    setCurrentCryptoBalance: (crypto: number) => void
}

export interface SimulatorOptionsContextITF {
    date: number,
    currency: CurrencyT,
    interval: IntervalT,
    cryptoType: CryptoTypeT,
    setDate: (date: number) => void
    setInterval: (interval: IntervalT) => void,
    setCurrency: (currency: CurrencyT) => void,
    setCryptoType: (crypto: CryptoTypeT) => void,
}

export interface SimulatorToolsContextITF {
    next: boolean
    isPlay: boolean,
    isStart: boolean,
    currentSpeed: CurrentSpeedT,
    setNext: (isNext: boolean) => void,
    setIsPlay: (isPlay: boolean) => void,
    setIsStart: (isStart: boolean) => void,
    setCurrentSpeed: (speed: CurrentSpeedT) => void,
}

export interface SimulatorTradingContextITF {
    process: ProcessT
    tradingType: TradingType
    setProcess: (process: ProcessT) => void
    setTradingType: (trading: TradingType) => void
}

export interface SimulatorPlayerInfoContextITF {
    balanceUSDT: number
    balanceTradeableCrypto: number
    setBalanceUSDT: (balance: (prev:number) => number) => void
    setBalanceTradeableCrypto: (balance: (prev:number) => number) => void
}

export interface SimulatorTradingChartDetailsContextITF {
    marketOrders: OrderITF[]
    limitOrders: OrderITF[]
    currentCryptoData: HistoryItem
    limitOrdersMarks: OrderMarkITF[]
    marketOrdersMarks: OrderMarkITF[]
    setCurrentCryptoData: (data: HistoryItem) => void
    setLimitOrders: (order: (prev: OrderITF[]) =>any[]) => void
    setMarketOrders: (order: (prev:OrderITF[]) => OrderITF[]) => void
    setLimitOrdersMarks:(mark: (prev:OrderMarkITF[]) => OrderMarkITF[]) => void
    setMarketOrdersMarks: (mark: (prev:OrderMarkITF[]) => OrderMarkITF[]) => void
}

export interface OrderITF {
    date: Date;
    symbol: SymbolT;
    side: SideT;
    quantity: number;
    stop_price: number;
    last: number;
    price: number;
    type: TypeT;
    limit_price: number;
    order_id: number;
    status: string
}

export interface OrderMarkITF {
    time: number,
    position: MarkPositionT,
    color: string,
    shape: MarkShapeT,
    id: string,
    text: string,
}

export type SymbolT = "ETH" | "BTC" | ""

export type SideT = "Buy" | "Sell" | ""

export type TypeT = "Market" | "Limit" | "Stop" | ""

export type StatusT = "Filled" | "Working" | "Canceled"

export type IntervalT = "histominute"

export type CurrencyT = "USD" | "EUR"

export type CryptoTypeT = "ETH" | "BTC"

export type CurrentSpeedT = 1 | 3 | 10

export type TradingType = "spot" | "futures"

export type ProcessT = "buy" | "sell" | ""

export type MarkPositionT = "aboveBar" | "belowBar" | "inBar"

export type MarkShapeT = "circle" | "arrowUp" | "arrowDown" | "triangleUp" | "triangleDown"