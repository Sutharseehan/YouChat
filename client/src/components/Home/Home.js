import React from "react";
import { withStyles } from '@material-ui/core/styles';
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import "./Home.css";
import ForumRoundedIcon from '@material-ui/icons/ForumRounded';

const styledBy = (property, mapping) => (props) => mapping[props[property]];

const styles = {
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

const StyledButton = withStyles(styles)(({ classes, color, ...other }) => (
    <Button className={classes.root} {...other} />
));


export default function Home() {
    const [firstButton] = React.useState('blue');
    const [secondButton] = React.useState('blackish');



    return (
        <div className="background">
            <div className="App">
                <header className="App-header">

                    <div>
                        <h1 className="title" style={{ fontFamily: "'Oswald', sans-serif", fontSize: "80px" }}><ForumRoundedIcon style={{ fontSize: "60px" }} /> YouChat</h1>
                    </div>

                    <div>
                        <h4 className="title" style={{ fontFamily: "'Oswald', sans-serif", fontSize: "20px", textShadow: "2px 2px black" }}>Login or register to join the chat room!</h4>
                    </div>

                    <div className="half-grid">

                        <div className="column">
                            <StyledButton color={firstButton} variant="contained" component={Link} to="/login">Login</StyledButton>
                        </div>

                        <div className="column">
                            <StyledButton color={secondButton} variant="contained" component={Link} to="/register">Register</StyledButton>
                        </div>

                        <div>

                        </div>

                    </div>

                </header>
            </div>
        </div>
    )
}