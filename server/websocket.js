const WebSocket = require("ws")
const processMessage = require("./utilities")
const Message = require("./models/messages")
const { v4: uuid } = require('uuid');
const http = require("http")
const jwt = require('jsonwebtoken')

const server = http.createServer();
const wss = new WebSocket.Server({ noServer: true })

let clients = [];

function setupWebSocketServer() {
    const wss = new WebSocket.Server({
        port: 1338
    })

    wss.on("connection", function connect(ws) {
        // a single client has joined

        ws.connectionID = uuid()
        clients.push(ws)
        console.log(clients)

        ws.on("close", () => {
            clients = clients.filter(
                (generalSocket) => generalSocket.connectionID !== ws.connectionID
            )
        })

        ws.on("message", function incoming(payload) {
            const message = processMessage(payload)

            if (!message || message.intent !== "chat") {
                // corrupted message from client
                // ignore
                return
            }

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
        })
    })
}

module.exports = setupWebSocketServer


// server.on('upgrade', function upgrade(request, socket, head) {
//     // This function is not defined on purpose. Implement it with your own logic.

//     console.log("REQUEST", request)

//     // const payload = jwt.verify()

//     // authenticate(request, (err, client) => {
//     //     if (err || !client) {
//     //         socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
//     //         socket.destroy();
//     //         return;
//     //     }

//     wss.handleUpgrade(request, socket, head, function done(ws) {
//         wss.emit('connection', ws, request);
//     });
//     // });
// });

// server.listen(1338);