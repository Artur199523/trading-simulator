import React, {useState} from "react";

import "./style.scss"
import {Button, Input} from "../../components";
import axios from "axios";
import {showNotification} from "../../utils";

const Faucet = () => {
    const [address, setAddress] = useState("")
    const [message, setMessage] = useState("")

    const chain = 'bnb-testnet'

    const apiUrl = `https://api.chainstack.com/v1/faucet/${chain}`;
    const apiKey = 'lI857jw3.UeBAGfbB92SNX1W7zX74WNSGVIyxxQtM';

    const fillWallet = async () => {
        if (address) {
            setMessage("")
            console.log(`Sending faucet request for address ${address}`)
            try {
                const response = await axios.post(apiUrl, {address}, {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                    },
                });

                console.log('API call successful:', response.data);
            } catch (error) {
                setMessage(error.response.data?.message || error.response.data?.error.message || error.message)
                console.log('Error making API call:', error.response.data);
            }
        } else {
            showNotification("Set address", "error", 0)
        }
    }

    return (
        <div className="faucet">
            <h1>BNB FAUCET</h1>

            <div className="faucet_input-block">
                <Input
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    type="text"
                    placeholder="Enter Your Wallet (0x..)"
                />
                <Button onClick={() => fillWallet()}>Send Me</Button>
                <p>{message}</p>
            </div>
        </div>
    )
}

export default Faucet