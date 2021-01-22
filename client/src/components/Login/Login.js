import React, { useState } from "react"
import "./Login.css"
import { TextField, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";



const styles = {
    root: {
        background: "",
        color: "white",
        "& .MuiFormLabel-root": {
            color: "white"
        }
    },
    input: {
        color: "white"
    }
};

function Login(props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function registerUser() {
        // MAKE A POST REQUEST TO THE SPECIFIED URL
        const res = await fetch("http://localhost:1337/api/register", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
                email,
                password
            })
            // CONVERT THE RESPONSE BACK TO JSON FORM
        }).then(t => t.json())

        console.log(res)
    }
    const { classes } = props;

    return (
        <div className="form">
            <h1>Register</h1>

            <form className="register-fields">

                {/* TEXTFIELD FOR EMAIL INPUT */}
                <div className="register-input">
                    <TextField
                        fullWidth
                        placeholder="Please enter an email"
                        label="Email"
                        variant="standard"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className={classes.root}
                        InputProps={{
                            className: classes.input
                        }}
                    />
                </div>

                {/* TEXTFIELD FOR PASSWORD INPUT */}
                <div className="register-input">
                    <TextField
                        fullWidth
                        placeholder="Please enter a password"
                        label="Password"
                        variant="standard"
                        color="primary"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className={classes.root}
                        InputProps={{
                            className: classes.input
                        }}
                    />
                </div>

                {/* REGISTER BUTTON */}
                <div>
                    <Button color="primary" variant="contained" onClick={registerUser} >Register</Button>
                </div>

            </form>
        </div>
    )
}



export default withStyles(styles)(Login);

