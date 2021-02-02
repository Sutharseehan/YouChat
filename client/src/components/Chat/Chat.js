import React, { useEffect, useState, useRef } from "react"
import { useHistory } from "react-router-dom";
import { Button, TextField } from "@material-ui/core"
import { withStyles, makeStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core'
import { white } from 'material-ui-colors'
import LetteredAvatar from 'react-lettered-avatar';
import PropTypes from "prop-types";


const whiteTheme = createMuiTheme({ palette: { primary: white } })

const styledBy = (property, mapping) => (props) => mapping[props[property]];

const styles = {
    root: {
        background: styledBy('color', {
            blue: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
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

const useMessageStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '36ch',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
    "&$MuiTypography-colorTextSecondary": {
        color: 'white !important'
    }
}));

const StyledButton = withStyles(styles)(({ classes, color, ...other }) => (
    <Button className={classes.root} {...other} type="submit" />
));

const textStyles = {
    root: {
        background: ""
    },
    input: {
        color: "white"
    }
};


function processMessage(payload) {
    try {
        return JSON.parse(payload)
    } catch (error) {
        return null
    }
}


function Chat(props) {
    const [Button] = React.useState('blue');
    const [chatMessage, setChatMessage] = useState('')
    const [chatMessages, setChatMessages] = useState([])
    const [wsRef, setWSRef] = useState(null)
    const messageClasses = useMessageStyles();
    const history = useHistory(0);

    const { classes } = props;

    function sendMessage() {
        if (wsRef?.readyState !== WebSocket.OPEN) {
            // websocket not connected
            return
        }
        wsRef.send(JSON.stringify({ message: chatMessage, intent: "chat" }))
        setChatMessage("")
    }

    function keyPress(e) {
        if (e.keyCode === 13) {
            sendMessage();
        }
    }

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:1338/" + localStorage.getItem("token"))
        ws.addEventListener("open", () => {
            ws.send(JSON.stringify({
                intent: "old-messages",
                count: 9
            }))
        }, { once: true })

        ws.addEventListener("error", () => {
            alert("Please login first")
            history.replace("/login")
        })

        ws.addEventListener('message', (event) => {
            const data = event.data

            const message = processMessage(data)

            if (!message) {
                return
            }

            if (message.intent === "chat") {
                setChatMessages(oldMessages => {
                    return [...oldMessages, message]
                })
            } else if (message.intent === "old-messages") {
                setChatMessages(message.data.map(item => {
                    return {
                        user: item.email,
                        message: item.message
                    }
                }).reverse())
            }
        })

        setWSRef(ws)

        return () => {
            ws.close()
        }
    }, [])




    const messagesEndRef = useRef(null)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    useEffect(scrollToBottom, [chatMessages]);


    return (
        <div>
            <div style={{ zIndex: "100" }}>
                <h1 style={{ textAlign: "center", backgroundColor: "rgb(28, 28, 33)" }}>Welcom to the Chat Room!</h1>
            </div>
            <div className="chat-background" style={{ textAlign: "center", paddingTop: "100px", zIndex: "99" }}>


                <div style={{ textAlign: "center", marginBottom: "50px", marginLeft: "20px" }}>{chatMessages.map((message, index) => {
                    return (
                        <MuiThemeProvider theme={whiteTheme}>
                            <div style={{ marginBottom: "10px" }}>
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <div style={{ marginRight: "20px" }}>
                                            <LetteredAvatar name={message.user} />
                                        </div>
                                    </ListItemAvatar>
                                    <div style={{ marginTop: "6px" }}>
                                        <ListItemText
                                            disableTypography
                                            primary={<Typography type="body2" style={{ color: '#707070', fontSize: "15px", marginTop: "-5px" }}>{message.user}</Typography>}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        className={messageClasses.inline}
                                                        color="textPrimary"
                                                    >
                                                    </Typography>
                                                    {message.message}
                                                </React.Fragment>
                                            }
                                        />
                                        <div ref={messagesEndRef} />
                                    </div>
                                </ListItem>
                            </div>
                        </MuiThemeProvider>



                    )
                })}</div>

                <div style={{ padding: "10px", position: "fixed", bottom: "0px", width: "100%", marginBottom: "-70px" }} ref={messagesEndRef}>
                    <TextField className={classes.root}
                        InputProps={{
                            className: classes.input
                        }} onChange={e => setChatMessage(e.target.value)} value={chatMessage} multiline variant="standard" color="primary" onKeyDown={keyPress} style={{ width: 500 }} />
                    <StyledButton color={Button} variant="contained" onClick={sendMessage} style={{ marginLeft: "50px", marginBottom: "100px" }}>
                        <SendIcon />
                    </StyledButton>
                </div>
            </div>
        </div>
    )
}

Chat.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(textStyles)(Chat)