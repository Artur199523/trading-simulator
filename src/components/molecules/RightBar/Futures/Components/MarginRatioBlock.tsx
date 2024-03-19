import React,{memo} from "react";
const MarginRatioBlock: React.FC = () => {
    return (
        <div className="futures_margin-ration">
            <h3>Margin Ratio</h3>
            <div>
                <span>Maintenance Margin</span>
                <span>0.0000 USDT</span>
            </div>
            <div>
                <span>Margin Balance</span>
                <span>0.0000 USDT</span>
            </div>
        </div>
    )
}

export default memo(MarginRatioBlock)