import React from "react"
import {ToastContainer} from "react-toastify"

const ToastGlobalContainer: React.FC = () => (
    <ToastContainer
        position="bottom-left"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={true}
        theme="dark"
    />
)

export default ToastGlobalContainer