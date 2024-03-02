import React, {memo, useState} from "react";
import {Input, CheckBox} from "components";
import {TPSLITF} from "./type";

const TPSL: React.FC<TPSLITF> = ({takeProfit, setTakeProfit, stopLoss, setStopLoss}) => {
    const [checked, setChecked] = useState(false)
    return (
        <div className="futures_tp-sl">
            <CheckBox extent="medium" checked={checked} name="TP/LS" onChange={() => setChecked(!checked)}>TP/LS</CheckBox>
            {
                checked &&
                <React.Fragment>
                    <Input
                        name="take_profit"
                        type="number"
                        value={takeProfit}
                        placeholder="Take Profit (%)"
                        onChange={(e) => setTakeProfit(e.target.value)}
                    />
                    <Input
                        name="stop_los"
                        type="number"
                        value={stopLoss}
                        placeholder="Stop Loss (%)"
                        onChange={(e) => setStopLoss(e.target.value)}
                    />
                </React.Fragment>
            }
        </div>
    )
}

export default memo(TPSL)