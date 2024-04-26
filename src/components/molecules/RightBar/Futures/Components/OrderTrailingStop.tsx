import React from "react";

import {showNotification} from "utils";

const OrderTrailingStop = () => <button onClick={() => showNotification("Not available yet", "info", 0)}>+ Add</button>

export default OrderTrailingStop