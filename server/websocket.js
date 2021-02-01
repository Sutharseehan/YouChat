const WebSocket = require("ws")
const Message = require("./models/messages")
const { v4: uuid } = require('uuid');
const http = require("http")
const jwt = require('jsonwebtoken')
const utilities = require("./utilities")

let clients = []

function setClients(newClients) {
    client = newClients
}

function broadCastMessage(message, ws) {
    const newMessage = new Message({
        email: ws.connectionID,
        message: message.message,
        date: Date.now()
    })

    newMessage.save()

    for (let i = 0; i < clients.length; i++) {
        const client = clients[i]
        console.log("The list of clients are: ", clients[i])
        client.send(JSON.stringify({
            message: message.message,
            user: ws.connectionID,
            intent: "chat"
        }))
    }
}

async function retrieveAndSendMessages(ws, count) {
    const messages = await Message.find({}, { email: 1, message: 1 }).sort({ date: -1 }).limit(count).lean()

    ws.send(JSON.stringify({
        intent: "old-messages",
        data: messages
    }))
}

const server = http.createServer();
const wss = new WebSocket.Server({ noServer: true })


module.exports = {


    setupWebSocketServer: function () {


        wss.on("connection", function connect(ws) {
            // a single client has joined

            clients.push(ws)
            console.log(clients)

            ws.on("close", () => {
                setClients(clients.filter(
                    (generalSocket) => generalSocket.connectionID !== ws.connectionID
                ))
            })

            ws.on("message", function incoming(payload) {
                const message = utilities.processMessage(payload)

                if (!message) {
                    // corrupted message from client
                    // ignore
                    return
                }

                if (message.intent === "chat") {
                    broadCastMessage(message, ws)
                } else if (message.intent === "old-messages") {
                    const count = message.count
                    if (!count) return

                    retrieveAndSendMessages(ws, count)
                }

            })
        })
    },

    setupWebSocketServerThing: function () {
        server.on('upgrade', function upgrade(request, socket, head) {

            const token = request.url.slice(1)

            let email = ""


            try {
                const payload = jwt.verify(token, utilities.JWT_SECRET_TOKEN)
                email = payload.email
            } catch (error) {
                socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                socket.destroy();
                return
            }
            wss.handleUpgrade(request, socket, head, function done(ws) {
                const _ws = ws


                ws.connectionID = email

                wss.emit('connection', ws, request);
            });
        });

        server.listen(1338);
    }




}