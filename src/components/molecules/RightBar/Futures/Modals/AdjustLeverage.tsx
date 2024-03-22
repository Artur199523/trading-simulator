import React, {useState} from "react";

import {useFuturesTradingModalContext, useSimulatorPlayerInfoContext, useSimulatorTradingContext} from "layouts/providers";

import {Button, Input, InputRangeSlider, ModalWindow} from "components";

import "./style.scss"

const AdjustLeverage: React.FC = () => {
    const [leverageInput, setLeverageInput] = useState("1")
    const [leverageRange, setLeverageRange] = useState(1)

    const {setCurrentModal} = useFuturesTradingModalContext()
    const {setAdjustLeverage,setTotalDepositWithLeverage} = useSimulatorTradingContext()
    const {balanceUSDT} = useSimulatorPlayerInfoContext()

    const confirmLeverage = () => {
        setAdjustLeverage(leverageRange)
        setCurrentModal("")

        setTotalDepositWithLeverage(balanceUSDT * Number(leverageInput))
    }

    const leverageInputHandle = (amount: string) => {
        if (Number(amount) <= 100) {
            setLeverageInput(amount)
            setLeverageRange(Number(amount))
        }
    }

    const leverageRangeHandle = (amount: number) => {
        if (amount <= 100) {
            setLeverageInput(amount.toString())
            setLeverageRange(amount)
        }
    }

    return (
        <ModalWindow show={true} title="Adjust Leverage">
            <div className="futures-modal_adjust-levrage">
                <span>Leverage</span>
                <Input
                    name="price"
                    type="number"
                    value={leverageInput}
                    onChange={(event) => leverageInputHandle(event.target.value)}
                />
                <InputRangeSlider
                    max={100}
                    symbol="X"
                    division={5}
                    name="leverage"
                    value={leverageRange}
                    onChange={(event) => leverageRangeHandle(event.target.value as any)}
                />
                <p>Selecting higher leverage such as [10x] increases your liquidation risk. Always manage your risk levels. See our help article for more
                    information.</p>
                <div className="futures-modal_btns">
                    <Button onClick={() => setCurrentModal("")}>Cancel</Button>
                    <Button onClick={confirmLeverage} view="two">Confirm</Button>
                </div>
            </div>
        </ModalWindow>
    )
}

export default AdjustLeverage