import {ToastTypeT} from "./type"
import {toast} from "react-toastify"

export const showNotification = (text: string, type: ToastTypeT, timeOut: number = 1000) => {
    setTimeout(() => {
        toast(text, {type: type})
    }, timeOut)
}