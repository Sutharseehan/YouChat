// const WebSocket = require("ws")
// const processMessage = require("./utilities")
// const Message = require("./models/messages")
// const { v4: uuid } = require('uuid');
// const http = require("http")
// const jwt = require('jsonwebtoken')

// let clients = []

// const server = http.createServer();
// const wss = new WebSocket.Server({ noServer: true })



// function setupWebSocketServer() {
//     const wss = new WebSocket.Server({
//         port: 1338
//     })
//     wss.on("connection", function connect(ws) {
//         // a single client has joined

//         ws.connectionID = uuid()
//         clients.push(ws)
//         console.log(clients)

//         ws.on("close", () => {
//             clients = clients.filter(
//                 (generalSocket) => generalSocket.connectionID !== ws.connectionID
//             )
//         })

//         ws.on("message", function incoming(payload) {
//             const message = processMessage(payload)

//             if (!message || message.intent !== "chat") {
//                 // corrupted message from client
//                 // ignore
//                 return
//             }

//             const newMessage = new Message({
//                 email: ws.connectionID,
//                 message: message.message,
//                 date: Date.now()
//             })

//             newMessage.save()

//             for (let i = 0; i < clients.length; i++) {
//                 const client = clients[i]
//                 console.log("The list of clients are: ", clients[i])
//                 client.send(JSON.stringify({
//                     message: message.message,
//                     user: ws.connectionID,
//                     intent: "chat"
//                 }))
//             }
//         })
//     })
// }


// module.exports = setupWebSocketServer







const WebSocket = require("ws")
const Message = require("./models/messages")
const { v4: uuid } = require('uuid');
const http = require("http")
const jwt = require('jsonwebtoken')
const utilities = require("./utilities")

let clients = []

const server = http.createServer();
const wss = new WebSocket.Server({ noServer: true })


module.exports = {


    setupWebSocketServer: function () {

        // const wss = new WebSocket.Server({
        //     port: 1338
        // })

        wss.on("connection", function connect(ws) {
            // a single client has joined

            clients.push(ws)
            console.log(clients)

            ws.on("close", () => {
                clients = clients.filter(
                    (generalSocket) => generalSocket.connectionID !== ws.connectionID
                )
            })

            ws.on("message", function incoming(payload) {
                const message = utilities.processMessage(payload)

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
    },

    setupWebSocketServerThing: function () {
        server.on('upgrade', function upgrade(request, socket, head) {
            // This function is not defined on purpose. Implement it with your own logic.

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
            // });
        });

        server.listen(1338);
    }




}