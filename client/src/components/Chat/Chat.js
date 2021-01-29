import React, { useEffect, useState, useRef } from "react"
import { useHistory } from "react-router-dom";
import { Button, TextField } from "@material-ui/core"
import { withStyles, makeStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core'
import { white } from 'material-ui-colors'


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



function processMessage(payload) {
    try {
        return JSON.parse(payload)
    } catch (error) {
        return null
    }
}


export default function Chat() {
    const [Button] = React.useState('blue');
    const [chatMessage, setChatMessage] = useState('')
    const [chatMessages, setChatMessages] = useState([])
    const [wsRef, setWSRef] = useState(null)
    const messageClasses = useMessageStyles();

    const history = useHistory(0);

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
            // ws.send(JSON.stringify({ status: "ok" }))
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

    useEffect(() => {
        scrollToBottom()
    }, []);


    return (
        <div>
            <div style={{ zIndex: "100" }}>
                <h1 style={{ textAlign: "center", backgroundColor: "#283747" }}>YouChat Room</h1>
            </div>
            <div className="chat-background" style={{ textAlign: "center", paddingTop: "100px", zIndex: "99" }}>


                <div style={{ textAlign: "center" }}>{chatMessages.map((message, index) => {
                    return (
                        <MuiThemeProvider theme={whiteTheme}>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={message.user}
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
                            </ListItem>
                        </MuiThemeProvider>



                    )
                })}</div>

                <div style={{ padding: "10px", position: "fixed", bottom: "0px", width: "100%", marginBottom: "-70px" }} ref={messagesEndRef}>
                    <TextField onChange={e => setChatMessage(e.target.value)} value={chatMessage} multiline variant="standard" color="primary" onKeyDown={keyPress} style={{ width: 500 }} />
                    <StyledButton color={Button} variant="contained" onClick={sendMessage} style={{ marginLeft: "50px", marginBottom: "100px" }}>
                        <SendIcon />
                    </StyledButton>
                </div>
            </div>
        </div>
    )
}