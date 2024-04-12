import {POSITION_HEADERS} from "utils";
import {PositionHeaderITF} from "./type";

// @TODO need to add info text
export const positionHeader: PositionHeaderITF[] = [
    {value: POSITION_HEADERS.CONTRACTS, displayName: "Contracts", isHoverInfo: false, info: ""},
    {value: POSITION_HEADERS.QUANTITY, displayName: "Qty", isHoverInfo: false, info: ""},
    {value: POSITION_HEADERS.VALUE, displayName: "Value", isHoverInfo: false, info: ""},
    {value: POSITION_HEADERS.ENTRY_PRICE, displayName: "Entry Price", isHoverInfo: true, info: ""},
    {value: POSITION_HEADERS.MARK_PRICE, displayName: "Mark Price", isHoverInfo: false, info: ""},
    {value: POSITION_HEADERS.LIQUIDITY_PRICE, displayName: "Liq. Price", isHoverInfo: true, info: ""},
    {value: POSITION_HEADERS.IM, displayName: "IM", isHoverInfo: true, info: ""},
    {value: POSITION_HEADERS.MM, displayName: "MM", isHoverInfo: true, info: ""},
    {value: POSITION_HEADERS.UNREALIZED_PL, displayName: "Unrealized P&L(%)", isHoverInfo: false, info: ""},
    {value: POSITION_HEADERS.REALIZED_PL, displayName: "Realized P&L", isHoverInfo: true, info: ""},
    {value: POSITION_HEADERS.TP_SL, displayName: "TP/SL", isHoverInfo: false, info: ""},
    {value: POSITION_HEADERS.TRAILING_STOP, displayName: "Trailing Stop", isHoverInfo: true, info: ""},
    {value: POSITION_HEADERS.MMR_CLOSE, displayName: "MMR Close", isHoverInfo: true, info: ""},
    {value: POSITION_HEADERS.REVERSE_POSITION, displayName: "Reverse Position", isHoverInfo: true, info: ""},
    {value: POSITION_HEADERS.CLOSE_BY, displayName: "Close By", isHoverInfo: false, info: ""},
]