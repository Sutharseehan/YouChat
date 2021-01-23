import React, { useState } from "react"
import "./Register.css"
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

const styledBy = (property, mapping) => (props) => mapping[props[property]];

const buttonStyles = {
    root: {
        background: styledBy('color', {
            blue: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            blackish: 'linear-gradient(45deg, #203647 30%, #12232E 90%)'
        }),
        borderRadius: 60,
        border: 0,
        color: 'white',
        height: 40,
        padding: '0 30px',
        boxShadow: styledBy('color', {
            blue: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            blackish: '0 3px 5px 2px #12232E'
        }),
    },
};

const StyledButton = withStyles(buttonStyles)(({ classes, color, ...other }) => (
    <Button className={classes.root} {...other} />
));



function Register(props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstButton] = React.useState('blue');

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
                <div className="column">
                    <StyledButton color={firstButton} variant="contained" onClick={registerUser} >Register</StyledButton>
                </div>

            </form>
        </div>
    )
}

export default withStyles(styles)(Register);