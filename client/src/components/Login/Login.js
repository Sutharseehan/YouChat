import React from "react"
import "./Login.css"
import { TextField } from "@material-ui/core"

export default function Login() {
    return (
        <div className="form">
            <h1>Login</h1>
            <form className="login-fields">
                <div className="login-input">
                    <TextField fullWidth placeholder="Please enter your email" label="Email" variant="outlined" />
                </div>
                <div className="login-input">
                    <TextField fullWidth placeholder="Please enter your password" label="Password" variant="outlined" />
                </div>
            </form>
        </div>
    )
}