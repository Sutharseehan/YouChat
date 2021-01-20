import React, {useState} from "react"
import "./Register.css"
import { TextField, Button } from "@material-ui/core"

export default function Register() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function registerUser() {
        const res = fetch("http://localhost:3001/api/register", {
            method: "POST",
            body: JSON.stringify({
                email,
                password
            })
        })
    }


    return (
        <div className="form">
            <h1>Register</h1>
            <form className="register-fields">
                <div className="register-input">
                    <TextField fullWidth placeholder="Please enter an email" label="Email" variant="outlined" text-color="white" value={email} onChange={e => setEmail(e.target.value)}/>
                </div>
                <div className="register-input">
                    <TextField fullWidth placeholder="Please enter a password" label="Password" variant="outlined" color="secondary" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div>
                    <Button color="primary" variant="contained" onClick={registerUser} >Register</Button>
                </div>
            </form>
        </div>
    )
}