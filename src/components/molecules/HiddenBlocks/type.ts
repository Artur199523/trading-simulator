import {MarginModeDataITF} from "utils/const/type";
import {MARGIN_MODE} from "utils";

export interface MarginItemITF {
    title: string
    mode: MARGIN_MODE
    isActive: boolean
    underTitle: string
    data: MarginModeDataITF[]
    callBackSettings: (mode: MARGIN_MODE) => void
    callBackRequirement: (mode: MARGIN_MODE) => void
}

export interface SettingsITF {
    className: string
}
