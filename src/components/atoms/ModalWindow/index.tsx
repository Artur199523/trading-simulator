import React, {useRef} from "react"
import * as ReactDOM from "react-dom"

import {ModalWindowITF} from "./type"

import "./style.scss"

const ModalWindow: React.FC<ModalWindowITF> = ({show, title, children}) => {
    const modalRef = useRef(null)

    return (
        <React.Fragment>
            {show &&
                ReactDOM.createPortal(
                    <div className="modal" ref={modalRef}>
                        <div>
                            <h2 data-testid="modal-title">{title}</h2>
                            {children && (
                                <div className="modal_content">
                                    {children}
                                </div>
                            )}
                        </div>
                    </div>,
                    document.querySelector<any>("body"),
                )}
        </React.Fragment>
    )
}

export default ModalWindow