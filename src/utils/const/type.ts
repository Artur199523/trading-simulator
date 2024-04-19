import {POSITION_HEADERS} from "../enums/futures";

export interface PositionHeaderITF {
    value: POSITION_HEADERS
    displayName: string
    isHoverInfo: boolean
    info: string
}

export interface MarginModeDataITF {
    section_name: string,
    list: string[]
}