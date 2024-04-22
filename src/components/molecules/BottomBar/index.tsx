import React, {memo, useState} from "react";

import {OrdersBlock} from "../../index";

import "./style.scss"

const BottomBar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="bottom-bar">
            <div className="bottom-bar_show-orders">
                <button onClick={() => setIsOpen(true)}>| Show Orders |</button>
            </div>
            <OrdersBlock isOpen={isOpen} setIsOpen={setIsOpen}/>
        </div>
    )
}

export default memo(BottomBar)