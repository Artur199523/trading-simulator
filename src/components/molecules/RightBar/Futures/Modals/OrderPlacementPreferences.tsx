import React, {useState} from "react";

import {useFuturesTradingModalContext, useSimulatorOptionsContext, useSimulatorTradingContext} from "layouts/providers";
import {MODALS, showNotification} from "utils";

import {Button, CheckBox, ModalWindow} from "components";

import "./style.scss"

const OrderPlacementPreferences: React.FC = () => {
    const {setCurrentModal} = useFuturesTradingModalContext()
    const {setOrderPlacementPreference} = useSimulatorTradingContext()
    const {cryptoType} = useSimulatorOptionsContext()

    const [isChecked, setIsChecked] = useState({crypto: false, usdt: true});

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name

        if (name === "usdt") {
            setIsChecked({crypto: false, usdt: true})
        } else {
            setIsChecked({crypto: true, usdt: false})
        }
    };
    const confirmPreference = () => {
        if (isChecked.crypto) {
            showNotification("Not available", "info", 0)
        } else {
            setOrderPlacementPreference("USDT")
            setCurrentModal(MODALS.CLOSE)
        }
    }

    return (
        <ModalWindow show={true} title="Order Placement Preferences">
            <div className="futures-modal_order_placement_preferences">
                <div className="futures-modal_order_placement_preferences_check-item">
                    <div className="futures-modal_order_placement_preferences_check-item_checkbox">
                        <CheckBox extent="medium" checked={isChecked.crypto} name="tradable_crypto" onChange={(event) => handleChange(event)}/>
                        <span>{cryptoType}</span>
                    </div>
                    <p>Please enter your order qty denominated in {cryptoType} terms.</p>
                </div>
                <div className="futures-modal_order_placement_preferences_check-item">
                    <div className="futures-modal_order_placement_preferences_check-item_checkbox">
                        <CheckBox extent="medium" checked={isChecked.usdt} name="usdt" onChange={(event) => handleChange(event)}/>
                        <span>USDT</span>
                    </div>
                    <p>Please enter your desired order value. You can modify the required margin by adjusting the applied leverage.</p>
                </div>
                <div className="futures-modal_order_placement_preferences_note">
                    <span>* Note</span>
                    <p>Your order quantity will be calculated based on the value of your filled order. Please note that in the event of extreme market
                        fluctuations,
                        your order placement may fail.</p>
                </div>
                <div className="futures-modal_btns">
                    <Button onClick={() => setCurrentModal(MODALS.CLOSE)}>Cancel</Button>
                    <Button onClick={confirmPreference} view="two">Confirm</Button>
                </div>
            </div>
        </ModalWindow>
    )
}

export default OrderPlacementPreferences