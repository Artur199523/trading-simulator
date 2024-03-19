import React from "react";

import {Button, ModalWindow} from "components";

import {ModalWindowTemplateITF} from "./type";

import "./style.scss"

const ModalWindowTemplate: React.FC<ModalWindowTemplateITF> = ({show, title, confirmCallback, cancelCallback, children}) => {
    return (
        <ModalWindow show={show} title={title}>
            {children}
            <div className="modal-btns">
                <Button onClick={() => cancelCallback()}>Cancel</Button>
                <Button onClick={() => confirmCallback()} view="two">Confirm</Button>
            </div>
        </ModalWindow>
    )
}

export default ModalWindowTemplate