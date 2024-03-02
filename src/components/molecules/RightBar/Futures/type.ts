import {Dispatch, SetStateAction} from "react";
import {ProcessFuturesT} from "../../../../layouts/providers/type";

export interface TPSLITF {
    takeProfit: string,
    stopLoss: string,
    setTakeProfit: Dispatch<SetStateAction<string>>,
    setStopLoss: Dispatch<SetStateAction<string>>
}

export interface TradeButtonsITF {
    onClick: (process: ProcessFuturesT) => void
}