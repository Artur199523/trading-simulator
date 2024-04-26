import React from "react";
import {showNotification} from "utils";

const OrderClosedBy = () => (
    <div>
        <button onClick={() => showNotification("Not available yet", "info", 0)}>Limit</button>
        &nbsp;
        <button onClick={() => showNotification("Not available yet", "info", 0)}>Market</button>
    </div>
)

export default OrderClosedBy