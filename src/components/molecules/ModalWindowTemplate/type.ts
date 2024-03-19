import {ModalWindowITF} from "components/atoms/ModalWindow/type";

export interface ModalWindowTemplateITF extends ModalWindowITF {
    confirmCallback: CallableFunction,
    cancelCallback: CallableFunction,
}