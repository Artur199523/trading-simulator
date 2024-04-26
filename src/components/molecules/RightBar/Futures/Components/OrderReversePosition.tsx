import React from "react";

import {showNotification} from "utils";

const OrderReversePosition = () => <button onClick={() => showNotification("Not available yet", "info", 0)}>Reverse</button>

export default OrderReversePosition;