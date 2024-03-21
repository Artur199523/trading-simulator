import React, {useState} from "react";

import {TRIGGERS, TRIGGERS_TEXT} from "utils";

import {CheckBox, ModalWindowTemplate} from "components";

import {TPSLTriggerIsCheckedITF, TPSLTriggerITF} from "../type";

import "../style.scss"

const TPSLTrigger: React.FC<TPSLTriggerITF> = ({type, currentTrigger, setCurrentTrigger}) => {
    const [checkedTrigger, setCheckedTrigger] = useState<TRIGGERS>(currentTrigger)
    const [isShow, setIsShow] = useState(false)

    const [isChecked, setIsChecked] = useState<TPSLTriggerIsCheckedITF>({roi: false, change: true, pl: false});

    const confirm = () => {
        setIsShow(false)
        setCurrentTrigger(checkedTrigger)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name

        switch (name) {
            case TRIGGERS.ROI:
                setIsChecked({roi: true, change: false, pl: false})
                setCheckedTrigger(name)
                break
            case TRIGGERS.CHANGE:
                setIsChecked({roi: false, change: true, pl: false})
                setCheckedTrigger(name)
                break
            case TRIGGERS.PL:
                setIsChecked({roi: false, change: false, pl: true})
                setCheckedTrigger(name)
                break
        }
    };

    return (
        <div className="futures_triggers">
            <div onClick={() => setIsShow(true)} className="futures_triggers_text">{type}-Trigger by {TRIGGERS_TEXT[currentTrigger]}<span>^</span></div>
            <ModalWindowTemplate confirmCallback={confirm} cancelCallback={() => setIsShow(false)} show={isShow} title="TP/SL Settings">
                <div className="futures_triggers_modal-triggers">
                    <div className="futures_triggers_modal-triggers_check-item">
                        <div className="futures_triggers_modal-triggers_check-item_checkbox">
                            <CheckBox
                                extent="medium"
                                name={TRIGGERS.ROI}
                                checked={isChecked.roi}
                                onChange={(event) => handleChange(event)}
                            >
                                Trigger by ROI (%)
                            </CheckBox>

                        </div>
                        <p>Please enter your desired ROI (%) to calculate the trigger price of TP/SL.</p>
                    </div>
                    <div className="futures_triggers_modal-triggers_check-item">
                        <div className="futures_triggers_modal-triggers_check-item_checkbox">
                            <CheckBox
                                extent="medium"
                                name={TRIGGERS.CHANGE}
                                checked={isChecked.change}
                                onChange={(event) => handleChange(event)}
                            >
                                Trigger by Change %
                            </CheckBox>
                        </div>
                        <p>Please enter your preferred TP/SL trigger price, or select a percentage increase or decrease of the entry price to calculate it.</p>
                    </div>
                    <div className="futures_triggers_modal-triggers_check-item">
                        <div className="futures_triggers_modal-triggers_check-item_checkbox">
                            <CheckBox
                                extent="medium"
                                name={TRIGGERS.PL}
                                checked={isChecked.pl}
                                onChange={(event) => handleChange(event)}
                            >
                                Trigger by P&L
                            </CheckBox>
                        </div>
                        <p>Please enter your expected profit or loss to calculate the trigger price of TP/SL.</p>
                    </div>
                    <p className="futures_triggers_modal-triggers_note">
                        <span>*</span> The selected TP/SL trigger method will be applicable to all newly placed
                        and modified TP/SL orders.
                    </p>
                </div>
            </ModalWindowTemplate>
        </div>
    )
}

export default TPSLTrigger